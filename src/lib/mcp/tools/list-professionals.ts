import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const categories = [
  "driving_instructor",
  "language_teacher",
  "music_teacher",
  "personal_trainer",
  "tutor",
] as const;

export default defineTool({
  name: "list_professionals",
  title: "Listar profissionais",
  description:
    "Lista profissionais publicamente visíveis na plataforma, com filtros opcionais de categoria, cidade e preço máximo por hora.",
  inputSchema: {
    category: z.enum(categories).optional().describe("Categoria do profissional."),
    city: z.string().trim().min(2).optional().describe("Cidade de atendimento."),
    max_price_per_hour: z.number().positive().optional().describe("Preço máximo por hora em BRL."),
    limit: z.number().int().min(1).max(50).default(20).describe("Número máximo de resultados."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, city, max_price_per_hour, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.rpc("list_public_professionals");
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = (data ?? [])
      .filter((p) => (category ? p.category === category : true))
      .filter((p) => (city ? (p.city ?? "").toLowerCase().includes(city.toLowerCase()) : true))
      .filter((p) =>
        max_price_per_hour ? (p.price_per_hour ?? 0) <= max_price_per_hour : true
      )
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        category: p.category,
        city: p.city,
        bio: p.bio,
        price_per_hour: p.price_per_hour,
        rating: p.rating,
        review_count: p.review_count,
        experience_years: p.experience_years,
        provider_type: p.provider_type,
        service_radius_km: p.service_radius_km,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { professionals: rows, count: rows.length },
    };
  },
});
