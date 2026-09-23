import Link from "next/link";
import { ArrowRight, Check, Images, MapPin, MessageCircle, Palette } from "lucide-react";

export default function Home() {
  return <main>
    <section className="hero"><div className="eyebrow">Sua vitrine digital, sem complicação</div><h1>Transforme seu negócio em uma <em>presença online.</em></h1><p>Crie uma página bonita, compartilhe seu link e seja encontrado por mais clientes. Você não precisa saber programar.</p><div className="actions"><Link className="button" href="/cadastro">Começar agora <ArrowRight size={18}/></Link><Link className="button secondary" href="/login">Já tenho uma conta</Link></div><div className="trust"><span><Check/> Fácil de criar</span><span><Check/> Perfeita no celular</span><span><Check/> Cancele quando quiser</span></div></section>
    <section className="features"><article><Palette/><h3>Com a sua cara</h3><p>Escolha a cor da marca e publique um perfil profissional.</p></article><article><Images/><h3>Mostre seu trabalho</h3><p>Logo e galeria com até seis fotos para conquistar clientes.</p></article><article><MessageCircle/><h3>Contato direto</h3><p>WhatsApp, telefone e Instagram sempre a um toque.</p></article><article><MapPin/><h3>Fácil de encontrar</h3><p>Mostre sua cidade e endereço com clareza.</p></article></section>
    <section className="cta"><h2>Sua empresa merece ser encontrada.</h2><p>Crie hoje o seu endereço digital.</p><Link className="button light" href="/cadastro">Criar minha página</Link></section>
  </main>;
}
