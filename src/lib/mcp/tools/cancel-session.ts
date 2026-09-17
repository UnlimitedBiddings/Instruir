import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "cancel_session",
  title: "Cancelar aula",
  description: "Cancela uma aula do usuário autenticado pelo identificador da aula.",
  inputSchema: {
    session_id: z.string().uuid().describe("Identificador da aula a cancelar."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ session_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("sessions")
      .update({ status: "cancelled" })
      .eq("id", session_id)
      .select("id, status, session_date, start_time")
      .maybeSingle();

    if (error) throw new ToolError(error.message);
    if (!data) {
      return {
        content: [{ type: "text", text: "Aula não encontrada ou sem permissão para cancelar." }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: `Aula ${data.id} cancelada.` }],
      structuredContent: { session: data },
    };
  },
});
