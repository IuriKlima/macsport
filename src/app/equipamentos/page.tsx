import Link from 'next/link'
import Image from 'next/image'
import { Filter } from 'lucide-react'
import { getProducts, slugify } from '@/lib/products'
import type { Metadata } from 'next'
import { EquipamentosGrid } from './EquipamentosGrid'
import { WhatsAppBanner } from '@/components/WhatsAppBanner'

export const metadata: Metadata = {
  title: 'Equipamentos Profissionais para Academias',
  description: 'Explore nosso catálogo completo de equipamentos profissionais. Linhas Uranos, New Evo, Sigma, Evo e Cromus com engenharia brasileira.',
  openGraph: {
    title: 'Equipamentos Profissionais para Academias',
    description: 'Explore nosso catálogo completo de equipamentos profissionais. Linhas Uranos, New Evo, Sigma, Evo e Cromus com engenharia brasileira.',
  },
}

export const revalidate = 60

export default async function EquipamentosPage({ searchParams }: { searchParams: Promise<{ categoria?: string, linha?: string }> }) {
  const resolvedSearchParams = await searchParams
  const categoriaAtiva = resolvedSearchParams.categoria || 'Todas'
  const linhaAtiva = resolvedSearchParams.linha || 'Todas'

  const equipamentos = await getProducts()
  
  // Extract unique Categories and Lines dynamically from DB
  const listaCategorias = Array.from(new Set(equipamentos.map((p: any) => p.categoria || p.subcategory))).filter(Boolean) as string[]
  const listaLinhas = Array.from(new Set(equipamentos.map((p: any) => p.linha || p.category))).filter(Boolean) as string[]

  // Filtra de acordo com a URL (Categoria e Linha)
  const produtosFiltrados = equipamentos.filter((p: any) => {
    const catDb = (p.categoria || p.subcategory || '').toLowerCase()
    const linhaDb = (p.linha || p.category || '').toLowerCase()
    
    const matchCat = categoriaAtiva === 'Todas' || catDb === categoriaAtiva.toLowerCase()
    const matchLinha = linhaAtiva === 'Todas' || linhaDb === linhaAtiva.toLowerCase()
    
    return matchCat && matchLinha
  })

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Header Section */}
      <section className="bg-[#111] pt-32 pb-48 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F5C400] opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm font-medium mb-8 text-gray-400">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              &lt; Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#F5C400] font-bold">Equipamentos</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Equipamentos
          </h1>
          <p className="text-xl text-gray-300 font-medium max-w-3xl">
            Soluções de <span className="text-[#F5C400]">musculação, cardio, estações e peso livre</span> para diferentes ambientes.
          </p>
        </div>
      </section>

      {/* Main Content overlapping */}
      <section className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10 mb-20">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtros */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-card-bg p-4 md:p-6 rounded-[2rem] sticky top-28 border border-border z-10">
              {/* Filtro: Categoria */}
              <div className="flex items-center gap-2 mb-4 lg:mb-6 text-lg font-semibold">
                <Filter className="text-[#F5C400]" size={20} />
                <span>Categorias</span>
              </div>
              <ul className="flex flex-row overflow-x-auto hide-scrollbar gap-2 lg:flex-col lg:space-y-2 lg:overflow-y-auto lg:max-h-[140px] custom-scrollbar pr-2 pb-4 lg:pb-0 mb-6 lg:mb-8">
                <li className="flex-shrink-0">
                  <Link 
                    href={`/equipamentos?categoria=Todas${linhaAtiva !== 'Todas' ? `&linha=${encodeURIComponent(linhaAtiva)}` : ''}`}
                    className={`block w-full text-center lg:text-left px-5 py-2 lg:py-2.5 rounded-[2rem] transition-colors font-medium whitespace-nowrap ${
                      categoriaAtiva === 'Todas' 
                        ? 'bg-[#F5C400] text-black font-bold border border-[#F5C400]' 
                        : 'bg-background lg:bg-transparent text-text-muted hover:bg-[#F5C400]/20 hover:text-foreground border border-border lg:border-transparent'
                    }`}
                  >
                    Todas
                  </Link>
                </li>
                {listaCategorias.map((cat, idx) => (
                  <li key={idx} className="flex-shrink-0">
                    <Link 
                      href={`/equipamentos?categoria=${encodeURIComponent(cat)}${linhaAtiva !== 'Todas' ? `&linha=${encodeURIComponent(linhaAtiva)}` : ''}`}
                      className={`block w-full text-center lg:text-left px-5 py-2 lg:py-2.5 rounded-[2rem] transition-colors font-medium whitespace-nowrap ${
                        categoriaAtiva.toLowerCase() === cat.toLowerCase() 
                          ? 'bg-[#F5C400] text-black font-bold border border-[#F5C400]' 
                          : 'bg-background lg:bg-transparent text-text-muted hover:bg-[#F5C400]/20 hover:text-foreground border border-border lg:border-transparent'
                      }`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Filtro: Linha */}
              <div className="flex items-center gap-2 mb-4 lg:mb-6 text-lg font-semibold">
                <Filter className="text-[#F5C400]" size={20} />
                <span>Linhas</span>
              </div>
              <ul className="flex flex-row overflow-x-auto hide-scrollbar gap-2 lg:flex-col lg:space-y-2 lg:overflow-y-auto lg:max-h-[140px] custom-scrollbar pr-2 pb-2 lg:pb-0">
                <li className="flex-shrink-0">
                  <Link 
                    href={`/equipamentos?linha=Todas${categoriaAtiva !== 'Todas' ? `&categoria=${encodeURIComponent(categoriaAtiva)}` : ''}`}
                    className={`block w-full text-center lg:text-left px-5 py-2 lg:py-2.5 rounded-[2rem] transition-colors font-medium whitespace-nowrap ${
                      linhaAtiva === 'Todas' 
                        ? 'bg-[#F5C400] text-black font-bold border border-[#F5C400]' 
                        : 'bg-background lg:bg-transparent text-text-muted hover:bg-[#F5C400]/20 hover:text-foreground border border-border lg:border-transparent'
                    }`}
                  >
                    Todas
                  </Link>
                </li>
                {listaLinhas.map((lin, idx) => (
                  <li key={idx} className="flex-shrink-0">
                    <Link 
                      href={`/equipamentos?linha=${encodeURIComponent(lin)}${categoriaAtiva !== 'Todas' ? `&categoria=${encodeURIComponent(categoriaAtiva)}` : ''}`}
                      className={`block w-full text-center lg:text-left px-5 py-2 lg:py-2.5 rounded-[2rem] transition-colors font-medium whitespace-nowrap ${
                        linhaAtiva.toLowerCase() === lin.toLowerCase() 
                          ? 'bg-[#F5C400] text-black font-bold border border-[#F5C400]' 
                          : 'bg-background lg:bg-transparent text-text-muted hover:bg-[#F5C400]/20 hover:text-foreground border border-border lg:border-transparent'
                      }`}
                    >
                      {lin}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div className="w-full lg:w-3/4">
            <EquipamentosGrid produtosFiltrados={produtosFiltrados} />
          </div>
        </div>
        </div>
      </section>

      <WhatsAppBanner />
    </main>
  )
}
