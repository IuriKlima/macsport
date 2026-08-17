"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToImgBB } from "@/lib/imgbb";
import { Trash2, Edit2, Plus, ArrowLeft, Upload } from "lucide-react";

export default function AdminRevendas() {
  const [revendas, setRevendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRevenda, setCurrentRevenda] = useState<any>(null);

  const [formData, setFormData] = useState({
    cidade: "",
    nome: "",
    endereco: "",
    telefone: "",
    logo_url: "",
  });

  useEffect(() => {
    fetchRevendas();
  }, []);

  const fetchRevendas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "revendas"));
      const revendasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRevendas(revendasData);
    } catch (error) {
      console.error("Erro ao buscar revendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const geocodeCity = async (city: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error("Erro no geocoding:", error);
    }
    return { lat: 0, lng: 0 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const coords = await geocodeCity(formData.cidade);
      const dataToSave = {
        ...formData,
        lat: coords.lat,
        lng: coords.lng
      };

      if (currentRevenda) {
        // Atualizar
        const revendaRef = doc(db, "revendas", currentRevenda.id);
        await updateDoc(revendaRef, dataToSave);
        alert("Revenda atualizada com sucesso!");
      } else {
        // Criar
        await addDoc(collection(db, "revendas"), dataToSave);
        alert("Revenda adicionada com sucesso!");
      }
      
      setIsEditing(false);
      setCurrentRevenda(null);
      setFormData({ cidade: "", nome: "", endereco: "", telefone: "", logo_url: "" });
      fetchRevendas();
    } catch (error) {
      console.error("Erro ao salvar revenda:", error);
      alert("Erro ao salvar. Tente novamente.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta revenda?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "revendas", id));
        fetchRevendas();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir. Tente novamente.");
        setLoading(false);
      }
    }
  };

  const editRevenda = (revenda: any) => {
    setCurrentRevenda(revenda);
    setFormData({
      cidade: revenda.cidade || "",
      nome: revenda.nome || "",
      endereco: revenda.endereco || "",
      telefone: revenda.telefone || "",
      logo_url: revenda.logo_url || "",
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentRevenda(null);
    setFormData({ cidade: "", nome: "", endereco: "", telefone: "", logo_url: "" });
  };

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>, revenda: any) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const url = await uploadToImgBB(e.target.files[0]);
        await updateDoc(doc(db, "revendas", revenda.id), {
          logo_url: url
        });
        fetchRevendas();
      } catch (err) {
        console.error(err);
        alert("Erro ao enviar a imagem. Tente novamente.");
        setLoading(false);
      }
    }
  };

  if (loading && revendas.length === 0) {
    return <div className="p-8 text-center text-gray-500 font-medium">Carregando dados...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Revendas</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-black text-[#F5C400] font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-900 transition-colors"
          >
            <Plus size={20} /> Nova Revenda
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b">
            <button onClick={cancelEdit} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {currentRevenda ? "Editar Revenda" : "Nova Revenda"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Local/Loja *</label>
                <input 
                  type="text" 
                  required
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
                  placeholder="Ex: Fitness Equipamentos SP"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade - Estado *</label>
                <input 
                  type="text" 
                  required
                  value={formData.cidade}
                  onChange={e => setFormData({...formData, cidade: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
                  placeholder="Ex: São Paulo - SP"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input 
                  type="text" 
                  value={formData.endereco}
                  onChange={e => setFormData({...formData, endereco: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
                  placeholder="Ex: Av. Paulista, 1000 - Bela Vista"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  value={formData.telefone}
                  onChange={e => setFormData({...formData, telefone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                <input 
                  type="text" 
                  value={formData.logo_url}
                  onChange={e => setFormData({...formData, logo_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
                  placeholder="https://..."
                />
                {formData.logo_url && (
                  <div className="mt-2 w-16 h-16 bg-gray-100 rounded border flex items-center justify-center p-1">
                    <img src={formData.logo_url} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={cancelEdit}
                className="px-6 py-2.5 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 rounded-full font-bold text-black bg-[#F5C400] hover:bg-[#e0b400] transition-colors disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar Revenda"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {revendas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhuma revenda cadastrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-700 text-sm uppercase font-semibold border-b">
                  <tr>
                    <th className="p-4">Logo</th>
                    <th className="p-4">Nome da Loja</th>
                    <th className="p-4 hidden md:table-cell">Endereço / Cidade</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {revendas.map(rev => (
                    <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 relative group cursor-pointer overflow-hidden border border-dashed border-gray-300 hover:border-[#F5C400] transition-colors">
                          {rev.logo_url ? (
                            <img src={rev.logo_url} alt={rev.nome} className="max-w-full max-h-full object-contain group-hover:opacity-40 transition-opacity" />
                          ) : (
                            <Upload size={16} className="text-gray-400 group-hover:opacity-40" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <span className="text-white text-[8px] font-bold px-1 text-center leading-tight">Trocar</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            title="Clique para alterar a logo"
                            onChange={(e) => handleQuickUpload(e, rev)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-medium">{rev.nome}</td>
                      <td className="p-4 text-sm text-gray-500 hidden md:table-cell">
                        {rev.cidade}<br/>
                        <span className="text-xs opacity-70">{rev.endereco}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => editRevenda(rev)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(rev.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
