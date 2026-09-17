import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

type AuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function oauthApi(): AuthOAuth {
  return (supabase.auth as unknown as { oauth: AuthOAuth }).oauth;
}

export function OAuthConsentPage() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Requisição inválida: falta o identificador de autorização.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauthApi().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const api = oauthApi();
    const { data, error: decideError } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (decideError) {
      setBusy(false);
      setError(decideError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou um destino de redirecionamento.");
      return;
    }
    window.location.href = target;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        {error ? (
          <>
            <h1 className="font-display text-xl font-semibold mb-2">Não foi possível continuar</h1>
            <p className="text-muted-foreground">{error}</p>
          </>
        ) : !details ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-muted-foreground">Carregando pedido de acesso...</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="font-display text-xl font-semibold">
                Conectar {details.client?.name ?? "aplicativo"}
              </h1>
            </div>
            <p className="text-muted-foreground mb-6">
              {details.client?.name ?? "Este aplicativo"} poderá acessar sua conta do Instruir e agir
              em seu nome: ver seu perfil, suas aulas e cancelar aulas.
            </p>
            <div className="flex gap-3">
              <Button variant="hero" size="lg" className="flex-1" disabled={busy} onClick={() => decide(true)}>
                Autorizar
              </Button>
              <Button variant="outline" size="lg" className="flex-1" disabled={busy} onClick={() => decide(false)}>
                Recusar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OAuthConsentPage;
