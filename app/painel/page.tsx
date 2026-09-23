import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardEditor } from "@/components/DashboardEditor";

export default async function Page(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");const [{data:business},{data:subscription}]=await Promise.all([supabase.from("businesses").select("*").maybeSingle(),supabase.from("subscriptions").select("status,provider_subscription_id,current_period_end").maybeSingle()]);const safeSubscription=subscription?.status==="active"&&(!subscription.current_period_end||new Date(subscription.current_period_end)<=new Date())?{...subscription,status:"suspended" as const}:subscription||{status:"none" as const};return <DashboardEditor initial={business} subscription={safeSubscription} email={user.email||""}/>}
