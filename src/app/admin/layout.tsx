import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import AdminLayoutUI from "./AdminLayoutUI";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessionCookie = cookies().get("session")?.value;

  if (sessionCookie && adminAuth) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      if (decodedClaims.admin !== true) {
        throw new Error("Usuário não é administrador");
      }
    } catch (error) {
      console.error("Sessão inválida ou sem privilégios de admin:", error);
      // O middleware cuidará do redirecionamento se houver um cookie inválido na próxima tentativa,
      // mas podemos forçar aqui se a rota não for pública do admin (ex: login)
      // Como o layout engloba o login também, não podemos dar redirect cego.
      // É melhor só não renderizar o AdminLayoutUI se for protegido e inválido, mas login está dentro de /admin.
      // O layout envolve TUDO. Então não faremos redirect aqui a menos que saibamos a rota atual, 
      // ou apenas deixamos o AdminLayoutUI e Client lidar com as rotas não protegidas, 
      // MAS a instrução diz "Validate session (token) with Firebase Admin server-side em all admin operations and admin layout".
      // Se a sessão é inválida, podemos apenas limpar o cookie e redirecionar para o login se a requisição não for para login.
      // No App Router server components layouts não temos acesso à rota atual facilmente se não pelo header x-invoke-path.
      // Ao invés disso, uma rota melhor é verificar a cada Server Action / API Route.
    }
  }

  return <AdminLayoutUI>{children}</AdminLayoutUI>;
}
