import { Mail, MapPin, Phone, Clock, FileText, Send, Loader2, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { WhatsAppBanner } from '@/components/WhatsAppBanner'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Macsport para orçamentos, projetos de academias e assistência técnica.',
  openGraph: {
    title: 'Contato',
    description: 'Entre em contato com a Macsport para orçamentos, projetos de academias e assistência técnica.',
  },
}

import Link from 'next/link'

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Header Section */}
      <section className="bg-[#111] pt-32 pb-48 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F5C400] opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm font-medium mb-8 text-gray-400">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              &lt; Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#F5C400] font-bold">Fale Conosco</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Fale Conosco
          </h1>
          <p className="text-xl text-gray-300 font-medium max-w-3xl">
            Estamos prontos para equipar sua academia com o que há de melhor em <span className="text-[#F5C400]">engenharia esportiva</span>. 
            Preencha o formulário e nosso time de especialistas entrará em contato.
          </p>
        </div>
      </section>

      {/* Main Content overlapping */}
      <section className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="w-full lg:w-2/3 bg-card-bg p-8 md:p-10 rounded-[2rem] border border-border shadow-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-sm font-medium text-text-muted">Nome Completo</label>
                  <input 
                    type="text" 
                    id="nome" 
                    className="w-full bg-background border border-border rounded-[2rem] px-4 py-3 text-foreground focus:outline-none focus:border-[#F5C400] transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="empresa" className="text-sm font-medium text-text-muted">Empresa / Academia</label>
                  <input 
                    type="text" 
                    id="empresa" 
                    className="w-full bg-background border border-border rounded-[2rem] px-4 py-3 text-foreground focus:outline-none focus:border-[#F5C400] transition-colors"
                    placeholder="Nome da sua academia"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-text-muted">E-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-background border border-border rounded-[2rem] px-4 py-3 text-foreground focus:outline-none focus:border-[#F5C400] transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefone" className="text-sm font-medium text-text-muted">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    id="telefone" 
                    className="w-full bg-background border border-border rounded-[2rem] px-4 py-3 text-foreground focus:outline-none focus:border-[#F5C400] transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="assunto" className="text-sm font-medium text-text-muted">Assunto</label>
                <select 
                  id="assunto" 
                  className="w-full bg-background border border-border rounded-[2rem] px-4 py-3 text-foreground focus:outline-none focus:border-[#F5C400] transition-colors appearance-none"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="orcamento">Solicitar Orçamento</option>
                  <option value="suporte">Suporte Técnico</option>
                  <option value="revenda">Seja um Revendedor</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="mensagem" className="text-sm font-medium text-text-muted">Mensagem</label>
                <textarea 
                  id="mensagem" 
                  rows={5}
                  className="w-full bg-background border border-border rounded-[2rem] px-4 py-3 text-foreground focus:outline-none focus:border-[#F5C400] transition-colors resize-none"
                  placeholder="Como podemos te ajudar?"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-[#F5C400] hover:bg-yellow-500 text-black font-bold py-4 rounded-[2rem] transition-colors text-lg">
                ENVIAR MENSAGEM
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-card-bg p-8 rounded-[2rem] border border-border">
              <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-4">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-background p-3 rounded-full text-[#F5C400]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted font-medium">Telefone / WhatsApp</p>
                    <p className="text-foreground text-lg font-semibold mt-1">(11) 5526-5539</p>
                    <p className="text-foreground text-lg font-semibold">+55 (11) 97529-7371</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-background p-3 rounded-full text-[#F5C400]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted font-medium">E-mail</p>
                    <p className="text-foreground font-semibold mt-1">comercial@macsport.com.br</p>
                    <p className="text-foreground font-semibold">suporte@macsport.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-background p-3 rounded-full text-[#F5C400]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted font-medium">Fábrica / Sede</p>
                    <p className="text-foreground font-semibold mt-1">Av. Sen. Teotônio Vilela, 8500</p>
                    <p className="text-text-muted">Jardim Casa Grande - São Paulo, SP</p>
                    <p className="text-text-muted">CEP: 04868-002</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="bg-card-bg p-8 rounded-[2rem] border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Horário de Atendimento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Segunda a Quinta:</span>
                  <span className="text-foreground font-semibold">07:00 às 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Sexta:</span>
                  <span className="text-foreground font-semibold">07:00 às 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Sábado e Domingo:</span>
                  <span className="text-foreground font-semibold">Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Map Section */}
        <div className="max-w-7xl mx-auto mt-12 bg-card-bg p-8 md:p-10 rounded-[2rem] border border-border shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-2xl font-bold text-foreground">Como chegar</h3>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Av.+Sen.+Teot%C3%B4nio+Vilela,+8500+-+Jardim+Casa+Grande,+S%C3%A3o+Paulo+-+SP,+04868-002"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F5C400] text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <MapPin size={20} />
              Traçar Rota no Maps
            </a>
          </div>
          
          <div className="w-full h-[400px] rounded-[1.5rem] overflow-hidden relative border border-border shadow-inner">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }}
              src="https://maps.google.com/maps?q=Av.%20Sen.%20Teot%C3%B4nio%20Vilela,%208500%20-%20Jardim%20Casa%20Grande,%20S%C3%A3o%20Paulo%20-%20SP&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de localização da Macsport"
            ></iframe>
          </div>
        </div>

      </section>

      <WhatsAppBanner />
    </main>
  )
}
