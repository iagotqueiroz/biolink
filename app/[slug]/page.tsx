import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BusinessPreview } from "@/components/BusinessPreview";
import type { Metadata } from "next";

type Props={params:Promise<{slug:string}>};
async function load(slug:string){const supabase=await createClient();const {data}=await supabase.from("businesses").select("*").eq("slug",slug).eq("is_published",true).maybeSingle();return data}
export async function generateMetadata({params}:Props):Promise<Metadata>{const item=await load((await params).slug);return item?{title:`${item.name} | Vitrine Local`,description:item.description}:{title:"Página não encontrada"}}
export default async function PublicPage({params}:Props){const item=await load((await params).slug);if(!item)notFound();return <BusinessPreview business={item}/>}
