import { cookies, headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import AdminLayoutUI from "./AdminLayoutUI";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const hostHeader = headersList.get('host') || '';
  const hostName = hostHeader.split(':')[0];
  
  const isAllowedHost = hostName === 'localhost' || hostName === '127.0.0.1' || hostName === '[::1]';

  if (
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_LOCAL_ADMIN !== "true" ||
    !isAllowedHost
  ) {
    notFound();
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (sessionCookie && adminAuth) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      if (decodedClaims.admin !== true) {
        throw new Error("Usuário não é administrador");
      }
    } catch (error) {
      console.error("Sessão inválida ou sem privilégios de admin:", error);
    }
  }

  return <AdminLayoutUI>{children}</AdminLayoutUI>;
}
