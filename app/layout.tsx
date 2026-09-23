import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "Vitrine Local", description: "Sua empresa online em poucos minutos" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><header className="topbar"><Link href="/" className="brand">Vitrine<span>Local</span></Link><nav><Link href="/login">Entrar</Link><Link className="button small" href="/cadastro">Criar minha página</Link></nav></header>{children}<footer>© {new Date().getFullYear()} Vitrine Local · Feito para negócios que fazem a cidade acontecer.</footer></body></html>;
}
