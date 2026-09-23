import { z } from "zod";

export const RESERVED_SLUGS = new Set([
  "admin", "api", "auth", "cadastro", "dashboard", "login", "painel", "recuperar-senha",
  "robots.txt", "sitemap.xml", "www",
]);

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 55);
}

export function isReservedSlug(slug: string) { return RESERVED_SLUGS.has(slug); }

const optionalUrl = z.union([z.literal(""), z.string().url().max(500)]).optional();

export const businessSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome").max(80),
  slug: z.string().trim().min(3).max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras, números e hífens")
    .refine((v) => !isReservedSlug(v), "Este endereço é reservado"),
  category: z.string().trim().min(2).max(50),
  description: z.string().trim().min(10).max(300),
  logo_url: optionalUrl,
  photos: z.array(z.string().url()).max(6),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().max(160).optional(),
  phone: z.string().trim().min(8).max(20).regex(/^[+\d ()-]+$/),
  whatsapp: z.string().trim().min(8).max(20).regex(/^[+\d ()-]+$/),
  instagram: z.string().trim().max(30).regex(/^@?[a-zA-Z0-9._]*$/).optional(),
});

export type BusinessInput = z.infer<typeof businessSchema>;

export function whatsappUrl(value: string) {
  return `https://wa.me/${value.replace(/\D/g, "")}`;
}
