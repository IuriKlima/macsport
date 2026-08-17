"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { Send, CheckCircle, TrendingUp, ShieldCheck, Settings } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function SejaRevendaClient() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cnpj: "",
    cidade: "",
    estado: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/forms/revenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Falha na API');
      setSuccess(true);
      setFormData({ nome: "", email: "", telefone: "", empresa: "", cnpj: "", cidade: "", estado: "", mensagem: "" });
    } catch (err: any) {
      console.error(err);
      setError("Houve um erro ao enviar seu cadastro. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const estadosBrasil = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Hero Section */}
      <section className="bg-[#111] pt-32 pb-40 px-4 md:px-8 lg:px-16 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src="/Logo Macsport Amarela.png" alt="Background" fill className="object-cover object-center grayscale mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-[#111]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-block px-4 py-1.5 bg-[#F5C400]/10 text-[#F5C400] font-bold text-sm tracking-wider rounded-full border border-[#F5C400]/30 mb-6">
              PARCERIA COMERCIAL MACSPORT
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight">
              Seja uma Revenda <span className="text-[#F5C400]">Autorizada</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-xl mb-8 leading-relaxed">
              Expanda seus negócios oferecendo os equipamentos fitness mais robustos do Brasil. 
              Alta rentabilidade e suporte direto da fábrica para você vender mais.
            </p>
            <a href="#cadastro" className="bg-[#F5C400] text-black font-black text-lg py-4 px-10 rounded-[2rem] hover:bg-yellow-500 transition-colors inline-flex items-center gap-2">
              Quero ser Revenda
            </a>
          </div>
          
          <div className="flex-1 hidden md:block">
            {/* Beneficios visuais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem]">
                <div className="w-12 h-12 bg-[#F5C400]/20 rounded-full flex items-center justify-center mb-4 text-[#F5C400]">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Alta Rentabilidade</h3>
                <p className="text-gray-400 text-sm">Margens competitivas direto da fábrica para impulsionar seus lucros.</p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem]">
                <div className="w-12 h-12 bg-[#F5C400]/20 rounded-full flex items-center justify-center mb-4 text-[#F5C400]">
                  <Settings size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Engenharia Nacional</h3>
                <p className="text-gray-400 text-sm">Design biomecânico premium 100% fabricado no Brasil.</p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] sm:col-span-2">
                <div className="w-12 h-12 bg-[#F5C400]/20 rounded-full flex items-center justify-center mb-4 text-[#F5C400]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Garantia & Peças</h3>
                <p className="text-gray-400 text-sm">5 anos de garantia estrutural e reposição imediata de peças direto da fábrica.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Form */}
      <section id="cadastro" className="px-4 md:px-8 lg:px-16 -mt-24 relative z-20 mb-20">
        <div className="max-w-4xl mx-auto">

        <div className="bg-card-bg border border-border p-8 md:p-12 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Preencha seus Dados</h2>
            <p className="text-text-muted">Nossa equipe comercial entrará em contato para apresentar as condições de parceria.</p>
          </div>

          {success ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Cadastro Enviado!</h2>
              <p className="text-gray-400 max-w-lg mx-auto text-lg mb-8">
                Recebemos suas informações com sucesso. Em breve um de nossos consultores especializados entrará em contato.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="bg-transparent text-[#F5C400] font-bold py-3 px-8 border border-[#F5C400] rounded-full hover:bg-[#F5C400] hover:text-black transition-colors"
              >
                Fazer outro cadastro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-sm text-center font-medium">
                  {error}
                </div>
              )}
              
              {/* Informações Pessoais */}
              <div className="space-y-6 pb-6 border-b border-border">
                <h3 className="text-lg font-bold text-[#F5C400] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#F5C400] text-black flex items-center justify-center text-sm">1</span>
                  Seus Dados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo *</label>
                    <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white" placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Telefone / WhatsApp *</label>
                    <input required type="tel" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white" placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">E-mail Profissional *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white" placeholder="voce@suaempresa.com.br" />
                </div>
              </div>

              {/* Informações da Empresa */}
              <div className="space-y-6 pt-2">
                <h3 className="text-lg font-bold text-[#F5C400] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#F5C400] text-black flex items-center justify-center text-sm">2</span>
                  Dados da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome da Empresa (Razão/Fantasia) *</label>
                    <input required type="text" name="empresa" value={formData.empresa} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white" placeholder="Nome da Loja/Empresa" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">CNPJ *</label>
                    <input required type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white" placeholder="00.000.000/0000-00" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Cidade Principal de Atuação *</label>
                    <input required type="text" name="cidade" value={formData.cidade} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white" placeholder="Sua Cidade" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Estado *</label>
                    <select required name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white">
                      <option value="">UF</option>
                      {estadosBrasil.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Conte um pouco sobre sua operação (Opcional)</label>
                  <textarea name="mensagem" value={formData.mensagem} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-[#F5C400] transition-colors text-white" placeholder="Quais marcas você já trabalha? Tem equipe de vendas externa?"></textarea>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full bg-[#F5C400] text-black font-black text-xl py-5 rounded-[2rem] hover:bg-yellow-500 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-[#F5C400]/20">
                  {loading ? "Processando..." : (
                    <>
                      <Send size={24} />
                      Solicitar Contato Comercial
                    </>
                  )}
                </button>
                <p className="text-center text-gray-500 text-xs mt-4">
                  Seus dados estão seguros. Ao enviar, você concorda em ser contatado pelo time Macsport.
                </p>
              </div>
            </form>
          )}
        </div>
        </div>
      </section>
    </main>
  );
}
