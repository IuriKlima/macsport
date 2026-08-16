"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package, FileText, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    produtos: 0,
    orcamentos: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [prodSnap, orcSnap, viewDoc] = await Promise.all([
          getDocs(collection(db, "produtos")),
          getDocs(collection(db, "orcamentos")),
          getDoc(doc(db, "analytics", "pageviews"))
        ]);

        setStats({
          produtos: prodSnap.size,
          orcamentos: orcSnap.size,
          views: viewDoc.exists() ? viewDoc.data().count : 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { title: "Visualizações do Site", value: stats.views, icon: <Eye size={24} className="text-blue-500" />, bgColor: "bg-blue-500/10" },
    { title: "Orçamentos Recebidos", value: stats.orcamentos, icon: <FileText size={24} className="text-green-500" />, bgColor: "bg-green-500/10" },
    { title: "Equipamentos Cadastrados", value: stats.produtos, icon: <Package size={24} className="text-[#F5C400]" />, bgColor: "bg-[#F5C400]/10" },
  ];

  if (loading) {
    return <div className="p-8">Carregando painel...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe o desempenho do seu site Macsport</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bgColor}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">Atividade Recente</h2>
        </div>
        <p className="text-gray-500">Utilize o menu lateral para gerenciar orçamentos, produtos e banners do site.</p>
      </div>
    </div>
  );
}
