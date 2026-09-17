import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProfessionalsTool from "./tools/list-professionals";
import getMyProfileTool from "./tools/get-my-profile";
import listMySessionsTool from "./tools/list-my-sessions";
import cancelSessionTool from "./tools/cancel-session";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "instruir",
  title: "Instruir",
  version: "0.1.0",
  instructions:
    "Ferramentas da plataforma Instruir. Use `list_professionals` para encontrar profissionais de ensino verificados, `get_my_profile` para os dados do usuário conectado, `list_my_sessions` para as aulas dele e `cancel_session` para cancelar uma aula.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProfessionalsTool, getMyProfileTool, listMySessionsTool, cancelSessionTool],
});
