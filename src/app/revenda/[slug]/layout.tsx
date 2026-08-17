import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { slugify } from '@/lib/products'

export const dynamic = 'force-dynamic';

export default async function ResellerLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode,
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  
  let revenda = null;
  try {
    const querySnapshot = await getDocs(collection(db, "revendas"))
    const revendas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    revenda = revendas.find((r: any) => slugify(r.nome) === resolvedParams.slug);
  } catch (error) {
    console.error("Erro ao buscar revenda no layout:", error)
  }

  if (!revenda) {
    notFound()
  }

  const cleanPhone = revenda.telefone ? revenda.telefone.replace(/\D/g, '') : '';
  const whatsappUrl = cleanPhone ? `https://wa.me/55${cleanPhone}` : '#';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Reseller Header */}
      <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-[#333] py-3 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="shrink-0 group flex items-center gap-2">
              <Image 
                src="/Logo Macsport Amarela.png" 
                alt="Macsport" 
                width={100} 
                height={32} 
                className="h-6 md:h-8 w-auto object-contain transition-transform group-hover:scale-105" 
                priority
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <span className="text-[#333] text-xl font-light">|</span>
              <div className="flex items-center gap-3">
                {revenda.logo_url && (
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden shrink-0 border border-gray-800">
                    <img src={revenda.logo_url} alt={revenda.nome} className="w-full h-full object-contain" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-[#F5C400] font-bold tracking-wider uppercase block leading-none mb-1">Distribuidor Oficial</span>
                  <span className="text-white font-medium text-sm leading-none block">{revenda.nome}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile simplified view */}
            <div className="flex md:hidden items-center gap-2 mr-2">
              {revenda.logo_url && (
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center p-0.5 overflow-hidden shrink-0 border border-gray-800">
                  <img src={revenda.logo_url} alt={revenda.nome} className="w-full h-full object-contain" />
                </div>
              )}
              <span className="text-white font-bold text-xs truncate max-w-[100px]">{revenda.nome}</span>
            </div>

            {cleanPhone && (
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white p-2 md:px-4 md:py-2 rounded-full hover:bg-[#128C7E] transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                <span className="hidden md:inline">Contato</span>
              </a>
            )}
          </div>

        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Reseller Footer */}
      <footer className="w-full bg-[#111] border-t border-[#333] py-12 px-4 md:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            {revenda.logo_url && (
              <div className="h-16 w-32 bg-white rounded flex items-center justify-center p-2 mb-2">
                <img src={revenda.logo_url} alt={revenda.nome} className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-white text-xl mb-1">{revenda.nome}</h3>
              <p className="text-[#F5C400] text-xs font-bold tracking-widest uppercase mb-4">Distribuidor Autorizado Macsport</p>
            </div>
            
            <div className="space-y-2 text-sm text-gray-400">
              {revenda.cidade && revenda.endereco && (
                <p className="flex items-start gap-2 justify-center md:justify-start">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{revenda.endereco} - {revenda.cidade}</span>
                </p>
              )}
              {revenda.telefone && (
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <svg className="w-4 h-4 shrink-0 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>{revenda.telefone}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-gray-500 text-xs">Fabricante Oficial:</span>
              <Link href="/" className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <Image 
                  src="/Logo Macsport Amarela.png" 
                  alt="Macsport" 
                  width={150} 
                  height={48} 
                  className="h-8 w-auto object-contain grayscale opacity-70 hover:grayscale-0 transition-all" 
                />
              </Link>
            </div>
            
            {cleanPhone && (
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-transparent border border-gray-700 text-gray-300 hover:text-[#F5C400] hover:border-[#F5C400] py-3 px-6 rounded-full font-medium transition-colors text-sm"
              >
                Solicite um orçamento direto com a loja
              </a>
            )}
          </div>
          
        </div>
      </footer>
      {cleanPhone && <WhatsAppButton phoneNumber={cleanPhone} />}
    </div>
  )
}
