import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_my_profile",
  title: "Meu perfil",
  description:
    "Retorna o perfil do usuário autenticado, incluindo papéis (aluno, profissional, administrador de escola).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    const [{ data: profile, error: profileError }, { data: roles }] = await Promise.all([
      supabase
        .from("profiles")
        .select("name, email, phone, city, state, avatar_url, created_at")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    if (profileError) {
      return { content: [{ type: "text", text: profileError.message }], isError: true };
    }

    const result = {
      profile: profile ?? null,
      roles: (roles ?? []).map((r) => r.role),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
