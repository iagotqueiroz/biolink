create extension if not exists pgcrypto;

create type public.subscription_status as enum ('none','active','pending','cancelled','suspended');

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 3 and 60),
  category text not null check (char_length(category) between 2 and 50),
  description text not null check (char_length(description) between 10 and 300),
  logo_url text,
  photos text[] not null default '{}' check (cardinality(photos) <= 6),
  primary_color text not null default '#175c46' check (primary_color ~ '^#[0-9a-fA-F]{6}$'),
  city text not null check (char_length(city) between 2 and 80),
  address text check (char_length(address) <= 160),
  phone text not null check (char_length(phone) between 8 and 20),
  whatsapp text not null check (char_length(whatsapp) between 8 and 20),
  instagram text check (char_length(instagram) <= 30),
  is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status public.subscription_status not null default 'none',
  provider_subscription_id text unique,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.webhook_events (
  id bigint generated always as identity primary key,
  provider text not null, event_id text not null, payload jsonb not null,
  received_at timestamptz not null default now(), unique(provider,event_id)
);

alter table public.businesses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.webhook_events enable row level security;

create or replace function public.has_active_subscription(owner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.subscriptions where user_id=owner and status='active' and current_period_end > now())
$$;
revoke all on function public.has_active_subscription(uuid) from public;
grant execute on function public.has_active_subscription(uuid) to anon, authenticated;

create policy "owner reads business" on public.businesses for select to authenticated using (auth.uid()=user_id);
create policy "public reads eligible pages" on public.businesses for select to anon using (is_published and public.has_active_subscription(user_id));
create policy "owner creates business" on public.businesses for insert to authenticated with check (auth.uid()=user_id);
create policy "owner updates business" on public.businesses for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "owner reads subscription" on public.subscriptions for select to authenticated using (auth.uid()=user_id);
create policy "owner starts pending subscription" on public.subscriptions for insert to authenticated with check (auth.uid()=user_id and status='pending');

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('business-images','business-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy "user uploads own images" on storage.objects for insert to authenticated
with check (bucket_id='business-images' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "user updates own images" on storage.objects for update to authenticated
using (bucket_id='business-images' and owner_id=auth.uid()::text);
create policy "user deletes own images" on storage.objects for delete to authenticated
using (bucket_id='business-images' and owner_id=auth.uid()::text);
create policy "public reads business images" on storage.objects for select to public using (bucket_id='business-images');

create or replace function public.enforce_reserved_slug() returns trigger language plpgsql as $$
begin
  if new.slug = any(array['admin','api','auth','cadastro','dashboard','login','painel','recuperar-senha','robots.txt','sitemap.xml','www']) then
    raise exception 'reserved slug' using errcode='23514';
  end if;
  return new;
end $$;
create trigger businesses_reserved_slug before insert or update of slug on public.businesses for each row execute function public.enforce_reserved_slug();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger businesses_updated_at before update on public.businesses for each row execute function public.touch_updated_at();

revoke all on public.webhook_events from anon, authenticated;
