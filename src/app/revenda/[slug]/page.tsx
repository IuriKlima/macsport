import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ArrowLeft, Phone } from 'lucide-react'
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getProducts, slugify } from '@/lib/products'
import ResellerProducts from './ResellerProducts'

export const dynamic = 'force-dynamic';

export default async function RevendaLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  // 1. Fetch all revendas to find by slug
  let revenda = null;
  try {
    const querySnapshot = await getDocs(collection(db, "revendas"))
    const revendas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Find matching revenda by slugifying the name
    revenda = revendas.find((r: any) => slugify(r.nome) === resolvedParams.slug);
  } catch (error) {
    console.error("Erro ao buscar revenda:", error)
  }

  if (!revenda) {
    notFound()
  }

  // 2. Fetch all products to display on the landing page
  const allProducts = await getProducts();
  
  // Clean phone for whatsapp
  const cleanPhone = revenda.telefone ? revenda.telefone.replace(/\D/g, '') : '';
  const whatsappUrl = cleanPhone ? `https://wa.me/55${cleanPhone}` : '#';

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Hero Banner */}
      <section className="bg-gray-900 pt-32 pb-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[#F5C400]" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/revendas" className="inline-flex items-center text-gray-400 hover:text-[#F5C400] transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" />
            VOLTAR PARA O MAPA DE REVENDAS
          </Link>

          <div className="inline-block px-3 py-1 bg-[#F5C400]/20 text-[#F5C400] text-xs font-bold tracking-wider rounded border border-[#F5C400]/30 mb-4 uppercase">
            DISTRIBUIDOR AUTORIZADO MACSPORT
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            {revenda.nome}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-gray-300 mb-10">
            {revenda.cidade && revenda.endereco && (
              <div className="flex items-start gap-3">
                <MapPin className="text-[#F5C400] shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-bold text-white mb-1">{revenda.cidade}</p>
                  <p className="text-sm max-w-xs">{revenda.endereco}</p>
                </div>
              </div>
            )}
            
            {revenda.telefone && (
              <div className="flex items-start gap-3">
                <Phone className="text-[#F5C400] shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-bold text-white mb-1">Contato</p>
                  <p className="text-sm">{revenda.telefone}</p>
                </div>
              </div>
            )}
          </div>

          {cleanPhone && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors py-4 px-8 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
              Falar no WhatsApp agora
            </a>
          )}
        </div>
      </section>

      {/* Seção de Equipamentos Integrada */}
      <section className="px-4 md:px-8 lg:px-16 -mt-10 relative z-20 mb-20">
        <div className="max-w-7xl mx-auto bg-card-bg p-8 md:p-12 rounded-[2rem] border border-border shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Equipamentos Macsport</h2>
            <p className="text-text-muted text-lg">
              Conheça as linhas de produtos disponíveis. Solicite sua cotação diretamente com <strong className="text-[#F5C400]">{revenda.nome}</strong> para obter as melhores condições para sua academia na região.
            </p>
          </div>

          <ResellerProducts products={allProducts} resellerPhone={cleanPhone} resellerName={revenda.nome} />
        </div>
      </section>
    </main>
  )
}
