"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function OrcamentoClient() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    perfil: "Academia",
    cidade: "",
    estado: "",
    etapa: "Planejamento",
    mensagem: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Salvar no Firebase
    try {
      await addDoc(collection(db, "orcamentos"), {
        cliente: formData,
        itens: items,
        status: "Novo",
        data: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao salvar orçamento no painel:", error);
    }

    const itemsText = items.map(
      (item) => `- ${item.quantity}x ${item.name} (${item.category})`
    ).join("\n");

    const message = `*NOVO ORÇAMENTO - MACSPORT*

*Dados do Cliente:*
Nome: ${formData.nome}
Telefone: ${formData.telefone}
Email: ${formData.email}

*Projeto:*
Perfil: ${formData.perfil}
Local: ${formData.cidade} - ${formData.estado}
Etapa: ${formData.etapa}

*Equipamentos Selecionados:*
${itemsText}

${formData.mensagem ? `*Mensagem adicional:*\n${formData.mensagem}` : ""}
`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "5511975297371"; // Macsport number from copy
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    
    // Clear cart after submitting
    clearCart();
    
    // Redirect back to home or show success message (optional)
    window.location.href = "/";
  };

  if (!mounted) return null;

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
            <span className="text-black font-bold">Orçamento</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-light mb-4 text-black">
            Seu Projeto
          </h1>
          <p className="text-xl text-black/80 font-medium max-w-3xl">
            Monte seu orçamento personalizado de equipamentos Macsport para sua academia ou studio.
          </p>
        </div>
      </section>

      {/* Main Content overlapping */}
      <section className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10 mb-20">
        <div className="max-w-6xl mx-auto">
          <Link href="/equipamentos" className="inline-flex items-center text-black hover:text-white bg-[#F5C400]/20 hover:bg-black transition-colors mb-8 text-sm font-medium py-2 px-4 rounded-full border border-black/10">
            <ArrowLeft size={16} className="mr-2" />
            CONTINUAR ESCOLHENDO
          </Link>

        {items.length === 0 ? (
          <div className="bg-card-bg border border-border rounded-[2rem] p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Sua lista está vazia</h2>
            <p className="text-text-muted mb-8">Explore os equipamentos e adicione os modelos do seu interesse para montar o seu projeto.</p>
            <Link href="/equipamentos" className="bg-[#F5C400] hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-[2rem] transition-colors">
              Explorar Equipamentos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card-bg border border-border rounded-[2rem] p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Equipamentos Selecionados</h2>
                
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="w-24 h-24 bg-white rounded-md p-2 flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <span className="text-[10px] text-[#F5C400] font-bold uppercase tracking-wider">{item.category}</span>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                      </div>

                      <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center bg-background border border-border rounded-md overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-[#F5C400] hover:text-black transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-[#F5C400] hover:text-black transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-text-muted hover:text-red-500 transition-colors ml-2"
                          title="Remover item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulário de Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-card-bg border border-border rounded-[2rem] p-6 md:p-8 sticky top-32">
                <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Detalhes do Projeto</h2>
                
                <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Nome Completo</label>
                    <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">WhatsApp</label>
                      <input required type="tel" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">E-mail</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Perfil do Negócio</label>
                    <select name="perfil" value={formData.perfil} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none">
                      <option>Academia</option>
                      <option>Estúdio</option>
                      <option>Condomínio</option>
                      <option>Clube</option>
                      <option>Empresa</option>
                      <option>Residência</option>
                      <option>Revenda</option>
                      <option>Outro</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Cidade</label>
                      <input required type="text" name="cidade" value={formData.cidade} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Estado (UF)</label>
                      <input required type="text" name="estado" value={formData.estado} onChange={handleChange} maxLength={2} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none uppercase" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Etapa do Projeto</label>
                    <select name="etapa" value={formData.etapa} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none">
                      <option>Planejamento</option>
                      <option>Cotação</option>
                      <option>Implantação</option>
                      <option>Expansão</option>
                      <option>Substituição de equipamentos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Mensagem (Opcional)</label>
                    <textarea name="mensagem" value={formData.mensagem} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-[#F5C400] outline-none resize-none" placeholder="Conte mais sobre o espaço ou prazo..."></textarea>
                  </div>

                  <button type="submit" className="w-full bg-[#F5C400] hover:bg-yellow-500 text-black font-bold py-4 rounded-[2rem] transition-colors mt-6 text-lg">
                    ENVIAR ORÇAMENTO
                  </button>
                  <p className="text-xs text-text-muted text-center mt-4">
                    Ao enviar, você será redirecionado para o WhatsApp com os detalhes do seu projeto.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
        </div>
      </section>
    </main>
  );
}
