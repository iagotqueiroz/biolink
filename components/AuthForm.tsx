"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" | "reset" | "update" }) {
  const router = useRouter(); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMessage("");
    const data = new FormData(e.currentTarget), email=String(data.get("email")||""), password=String(data.get("password")||"");
    const supabase=createClient(); let error;
    if(mode==="signup") ({error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${location.origin}/auth/callback?next=/painel`}}));
    else if(mode==="login") ({error}=await supabase.auth.signInWithPassword({email,password}));
    else if(mode==="reset") ({error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/auth/callback?next=/nova-senha`}));
    else ({error}=await supabase.auth.updateUser({password}));
    setLoading(false);
    if(error) return setMessage(error.message);
    if(mode==="login"||mode==="update") { router.push("/painel"); router.refresh(); }
    else setMessage(mode==="signup"?"Cadastro recebido. Confira seu e-mail para confirmar a conta.":"Enviamos o link de recuperação para seu e-mail.");
  }
  const title={login:"Bem-vindo de volta",signup:"Crie sua conta",reset:"Recupere sua senha",update:"Escolha uma nova senha"}[mode];
  return <main className="auth-shell"><form className="card" onSubmit={submit}><h1>{title}</h1><p className="muted">{mode==="signup"?"Sua vitrine profissional começa aqui.":"Use seus dados para continuar."}</p>{message&&<p className={`notice ${message.includes("recebido")||message.includes("Enviamos")?"success":"error"}`}>{message}</p>}{mode!=="update"&&<div className="field"><label>E-mail</label><input name="email" type="email" required maxLength={200} autoComplete="email"/></div>}{mode!=="reset"&&<div className="field"><label>Senha</label><input name="password" type="password" required minLength={8} maxLength={72} autoComplete={mode==="login"?"current-password":"new-password"}/></div>}<button className="button wide" disabled={loading}>{loading?"Aguarde...":mode==="login"?"Entrar":mode==="signup"?"Criar conta":"Continuar"}</button><div className="auth-links">{mode==="login"&&<><Link href="/cadastro">Criar conta</Link><Link href="/recuperar-senha">Esqueci a senha</Link></>}{mode==="signup"&&<Link href="/login">Já tenho uma conta</Link>}</div></form></main>;
}
