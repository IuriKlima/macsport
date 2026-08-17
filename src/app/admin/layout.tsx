"use client";

import AdminRoute from "@/components/AdminRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LayoutDashboard, Package, FileText, Image as ImageIcon, LogOut, Settings, BookOpen, MapPin, Info } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Se estiver na tela de login ou signup, não renderiza o sidebar
  if (pathname === "/admin/login" || pathname === "/admin/signup") {
    return <AdminRoute>{children}</AdminRoute>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await signOut(auth);
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Orçamentos", href: "/admin/orcamentos", icon: <FileText size={20} /> },
    { name: "Leads Revendas", href: "/admin/leads-revendas", icon: <FileText size={20} /> },
    { name: "Equipamentos", href: "/admin/produtos", icon: <Package size={20} /> },
    { name: "Banners/Slides", href: "/admin/slides", icon: <ImageIcon size={20} /> },
    { name: "Blog", href: "/admin/blog", icon: <BookOpen size={20} /> },
    { name: "Revendas", href: "/admin/revendas", icon: <MapPin size={20} /> },
    { name: "Quem Somos", href: "/admin/quem-somos", icon: <Info size={20} /> },
    { name: "Configurações", href: "/admin/configuracoes", icon: <Settings size={20} /> },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col hidden md:flex">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#F5C400]">Macsport</h2>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Painel Administrativo</span>
          </div>
          
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                        isActive 
                          ? "bg-[#F5C400] text-black font-semibold border-r-4 border-black" 
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full text-left text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              <LogOut size={20} />
              Sair do Painel
            </button>
          </div>
        </aside>

        {/* Mobile Header (fallback) */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center z-50">
          <h2 className="text-xl font-bold text-[#F5C400]">Macsport Admin</h2>
          <button onClick={handleLogout}><LogOut size={20} /></button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto mt-16 md:mt-0 relative">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}
