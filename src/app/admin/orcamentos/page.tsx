"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Eye, CheckCircle, Clock } from "lucide-react";

export default function AdminOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchOrcamentos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orcamentos"), orderBy("data", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrcamentos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orcamentos", id), { status: newStatus });
      setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selected?.id === id) {
        setSelected({ ...selected, status: newStatus });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orçamentos Recebidos</h1>

      {selected ? (
        <div className="bg-white p-6 rounded-t-2xl rounded-b-none shadow-sm border border-gray-200">
          <button 
            onClick={() => setSelected(null)}
            className="text-[#F5C400] font-bold text-sm mb-6 hover:underline"
          >
            &larr; Voltar para a lista
          </button>
          
          <div className="flex justify-between items-start mb-6 border-b pb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selected.cliente.nome}</h2>
              <p className="text-gray-500">{selected.cliente.perfil} • {selected.cliente.cidade}/{selected.cliente.estado}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleUpdateStatus(selected.id, "Em Atendimento")}
                className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-2 ${selected.status === "Em Atendimento" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <Clock size={16} /> Em Atendimento
              </button>
              <button 
                onClick={() => handleUpdateStatus(selected.id, "Concluído")}
                className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-2 ${selected.status === "Concluído" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <CheckCircle size={16} /> Concluído
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Dados de Contato</h3>
              <ul className="space-y-3 text-sm">
                <li><span className="text-gray-500 block">WhatsApp:</span> <a href={`https://wa.me/55${selected.cliente.telefone.replace(/\D/g, '')}`} target="_blank" className="text-blue-600 hover:underline">{selected.cliente.telefone}</a></li>
                <li><span className="text-gray-500 block">E-mail:</span> {selected.cliente.email}</li>
                <li><span className="text-gray-500 block">Etapa do Projeto:</span> {selected.cliente.etapa}</li>
                {selected.cliente.mensagem && (
                  <li className="mt-4"><span className="text-gray-500 block">Mensagem:</span> <p className="bg-gray-50 p-3 rounded border border-gray-100 mt-1">{selected.cliente.mensagem}</p></li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Equipamentos Solicitados</h3>
              <div className="bg-gray-50 rounded border border-gray-100 divide-y divide-gray-200">
                {selected.itens?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-white rounded" />}
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-t-2xl rounded-b-none shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando orçamentos...</div>
          ) : orcamentos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum orçamento recebido ainda.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orcamentos.map((orc) => (
                  <tr key={orc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(orc.data)}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{orc.cliente?.nome}</div>
                      <div className="text-xs text-gray-500">{orc.cliente?.perfil} • {orc.cliente?.cidade}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{orc.cliente?.telefone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        orc.status === "Novo" ? "bg-yellow-100 text-yellow-800" : 
                        orc.status === "Em Atendimento" ? "bg-blue-100 text-blue-800" : 
                        "bg-green-100 text-green-800"
                      }`}>
                        {orc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelected(orc)}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1 ml-auto"
                      >
                        <Eye size={16} /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
