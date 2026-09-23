import { describe, expect, it } from "vitest";
import { businessSchema, isReservedSlug, slugify, whatsappUrl } from "./validation";

describe("identificador público", () => {
  it("remove acentos e símbolos", () => expect(slugify("Padaria da María! ")).toBe("padaria-da-maria"));
  it("bloqueia rotas do sistema", () => expect(isReservedSlug("login")).toBe(true));
  it("monta link limpo do WhatsApp", () => expect(whatsappUrl("+55 (11) 99999-0000")).toBe("https://wa.me/5511999990000"));
});

describe("formulário", () => {
  it("rejeita mais de seis fotos", () => {
    const value = { name: "Loja", slug: "minha-loja", category: "Varejo", description: "Uma descrição válida", photos: Array(7).fill("https://a.com/a.jpg"), primary_color: "#123456", city: "Recife", phone: "8199999999", whatsapp: "8199999999" };
    expect(businessSchema.safeParse(value).success).toBe(false);
  });
});
