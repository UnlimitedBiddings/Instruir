import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const statuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"] as const;

export default defineTool({
  name: "list_my_sessions",
  title: "Minhas aulas",
  description:
    "Lista as aulas do usuário autenticado (como aluno ou profissional), com filtro opcional de status.",
  inputSchema: {
    status: z.enum(statuses).optional().describe("Filtrar por status da aula."),
    limit: z.number().int().min(1).max(100).default(25).describe("Número máximo de aulas."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("sessions")
      .select(
        "id, category, session_date, start_time, end_time, status, price, address, city, notes, rating"
      )
      .order("session_date", { ascending: true })
      .limit(limit);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { sessions: data ?? [], count: (data ?? []).length },
    };
  },
});
