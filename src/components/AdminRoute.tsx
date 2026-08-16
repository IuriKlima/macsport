"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const isPublicRoute = pathname === "/admin/login" || pathname === "/admin/signup";

      if (!currentUser && !isPublicRoute) {
        router.push("/admin/login");
      } else if (currentUser && isPublicRoute) {
        router.push("/admin");
      }
      
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-[#F5C400] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in and not on a public route, render nothing while redirecting
  const isPublicRoute = pathname === "/admin/login" || pathname === "/admin/signup";
  if (!user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
