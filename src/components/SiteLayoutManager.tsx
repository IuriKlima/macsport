"use client";
import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { MainHeader } from "./MainHeader";

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/revenda/")) return null;
  return (
    <>
      <TopBar />
      <MainHeader />
    </>
  );
}

export function SiteFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/revenda/")) return null;
  return <>{children}</>;
}
