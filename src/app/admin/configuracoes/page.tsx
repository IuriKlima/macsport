"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Check, Settings, Mail, Phone, MapPin } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    emailContato: "contato@macsport.com.br",
    telefoneContato: "(11) 9999-9999",
    endereco: "São Paulo, SP - Brasil",
    linkInstagram: "",
    linkFacebook: "",
    linkYoutube: "",
    linkLinkedin: "",
    whatsapp: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, "configuracoes", "geral");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({ ...formData, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Erro ao carregar configs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await setDoc(doc(db, "configuracoes", "geral"), formData, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={32} className="text-[#F5C400]" />
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Site</h1>
      </div>

      <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          
          {/* Informações de Contato */}
          <div>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Phone size={20} className="text-gray-400" />
              Contatos Visíveis no Site
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input type="email" name="emailContato" value={formData.emailContato} onChange={handleChange} className="pl-10 w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal (Rodapé)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input type="text" name="telefoneContato" value={formData.telefoneContato} onChange={handleChange} className="pl-10 w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Link direto)</label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Ex: 5511999999999" className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Físico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="pl-10 w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              Redes Sociais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link do Instagram</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <input type="url" name="linkInstagram" value={formData.linkInstagram} onChange={handleChange} placeholder="https://instagram.com/..." className="pl-10 w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link do Facebook</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </div>
                  <input type="url" name="linkFacebook" value={formData.linkFacebook} onChange={handleChange} placeholder="https://facebook.com/..." className="pl-10 w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link do YouTube</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                  </div>
                  <input type="url" name="linkYoutube" value={formData.linkYoutube} onChange={handleChange} placeholder="https://youtube.com/..." className="pl-10 w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link do LinkedIn</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </div>
                  <input type="url" name="linkLinkedin" value={formData.linkLinkedin} onChange={handleChange} placeholder="https://linkedin.com/..." className="pl-10 w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[#F5C400] text-black px-8 py-3 rounded font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar Configurações"}
            </button>
            {success && (
              <span className="text-green-600 flex items-center gap-1 font-medium">
                <Check size={18} /> Salvo com sucesso!
              </span>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
