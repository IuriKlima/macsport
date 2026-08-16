"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Briefcase, Send, CheckCircle, Upload } from "lucide-react";
import Link from 'next/link';

export default function TrabalheConoscoClient() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    linkedin: "",
    mensagem: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let fileUrl = "";
      if (file) {
        // Envia o arquivo para o Firebase Storage
        const storageRef = ref(storage, `curriculos/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, "curriculos"), {
        ...formData,
        curriculo_url: fileUrl,
        data: serverTimestamp(),
        status: "Novo"
      });
      setSuccess(true);
      setFormData({ nome: "", email: "", telefone: "", linkedin: "", mensagem: "" });
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError("Houve um erro ao enviar seu perfil. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Header Section (Yellow) */}
      <section className="bg-[#F5C400] pt-32 pb-48 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm font-medium mb-8 text-black/70">
            <Link href="/" className="hover:text-black flex items-center gap-1">
              &lt; Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black font-bold">Trabalhe Conosco</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-light mb-4 text-black">
            Trabalhe Conosco
          </h1>
          <p className="text-xl text-black/80 font-medium max-w-3xl">
            Faça parte da equipe que desenvolve a engenharia de performance do Brasil. 
            Envie seu perfil e entraremos em contato assim que surgir uma oportunidade!
          </p>
        </div>
      </section>

      {/* Main Content overlapping */}
      <section className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10 mb-20">
        <div className="max-w-3xl mx-auto">

        <div className="bg-card-bg border border-border p-8 md:p-12 rounded-[2rem] shadow-xl">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Perfil Enviado com Sucesso!</h2>
              <p className="text-text-muted">
                Agradecemos o seu interesse em fazer parte da Macsport. 
                Seu perfil foi salvo em nosso banco de talentos e entraremos em contato caso haja compatibilidade com novas vagas.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-8 bg-transparent text-[#F5C400] font-bold py-2 px-6 border border-[#F5C400] rounded hover:bg-[#F5C400] hover:text-black transition-colors"
              >
                Enviar outro perfil
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded text-sm text-center font-medium">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo *</label>
                  <input
                    required
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full bg-background border border-gray-700 rounded px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-foreground"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">E-mail *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-background border border-gray-700 rounded px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-foreground"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Telefone / WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full bg-background border border-gray-700 rounded px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-foreground"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Link do LinkedIn (Opcional)</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full bg-background border border-gray-700 rounded px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-foreground"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Resumo das suas experiências / Mensagem</label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-background border border-gray-700 rounded px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-foreground"
                  placeholder="Conte um pouco sobre sua trajetória profissional, áreas de interesse e como você pode contribuir para a Macsport..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Anexar Currículo (PDF ou Word)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="curriculo-upload"
                  />
                  <label 
                    htmlFor="curriculo-upload"
                    className="flex items-center gap-3 w-full bg-background border border-dashed border-gray-600 rounded px-4 py-4 cursor-pointer hover:border-[#F5C400] transition-colors text-text-muted hover:text-foreground"
                  >
                    <Upload size={20} className={file ? "text-[#F5C400]" : ""} />
                    {file ? (
                      <span className="text-foreground font-medium truncate">{file.name}</span>
                    ) : (
                      <span>Clique para selecionar ou arraste o arquivo aqui</span>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F5C400] text-black font-bold text-lg py-4 rounded-[2rem] hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                {loading ? "Enviando..." : (
                  <>
                    <Send size={20} />
                    Enviar Currículo
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        </div>
      </section>
    </main>
  );
}
