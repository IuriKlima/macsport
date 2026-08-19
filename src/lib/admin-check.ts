import { headers } from "next/headers";
import { notFound } from "next/navigation";

export async function verifyLocalAdmin() {
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
}
