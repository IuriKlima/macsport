"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, CheckCircle, Clock, FileSpreadsheet } from "lucide-react";
import Papa from "papaparse";

export default function LeadsRevendasAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "revendas_leads"), orderBy("data", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const item = doc.data();
        return {
          id: doc.id,
          ...item,
          dataStr: item.data?.toDate ? item.data.toDate().toLocaleString('pt-BR') : 'Data não disponível'
        };
      });
      setLeads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente excluir este lead de revenda?")) {
      await deleteDoc(doc(db, "revendas_leads", id));
      fetchLeads();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Novo" ? "Contatado" : "Novo";
    await updateDoc(doc(db, "revendas_leads", id), { status: newStatus });
    fetchLeads();
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    const exportData = leads.map(l => ({
      Nome: l.nome,
      Empresa: l.empresa,
      CNPJ: l.cnpj,
      Email: l.email,
      Telefone: l.telefone,
      Cidade: l.cidade,
      Estado: l.estado,
      Mensagem: l.mensagem,
      Status: l.status,
      Data: l.dataStr
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads_revendas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads de Revendas</h1>
        <button 
          onClick={handleExportCSV}
          className="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <FileSpreadsheet size={20} /> Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden mb-8">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum interessado em revenda ainda.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Local</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {lead.dataStr}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{lead.nome}</div>
                    <div className="text-xs">{lead.email}</div>
                    <div className="text-xs text-blue-600">{lead.telefone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{lead.empresa}</div>
                    <div className="text-xs text-gray-500">CNPJ: {lead.cnpj}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{lead.cidade} / {lead.estado}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggleStatus(lead.id, lead.status || "Novo")}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        lead.status === "Contatado" 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {lead.status === "Contatado" ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {lead.status || "Novo"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleDelete(lead.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
