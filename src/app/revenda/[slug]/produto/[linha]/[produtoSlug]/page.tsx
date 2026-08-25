export const dynamic = 'force-dynamic';
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Check } from 'lucide-react'
import { getProductBySlugAndLinha, getProducts, slugify } from '@/lib/products'
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { notFound } from 'next/navigation'
import ReviewsSlider from '@/components/ReviewsSlider'
import { ProductTabs } from '@/app/produto/[linha]/[slug]/ProductTabs'
import { ShareButton } from '@/components/ShareButton'

export const dynamic = 'force-dynamic';

export default async function RevendaProdutoPage({ params }: { params: Promise<{ slug: string, linha: string, produtoSlug: string }> }) {
  const resolvedParams = await params
  const { slug, linha, produtoSlug } = resolvedParams

  // 1. Fetch Revenda
  let revenda: any = null;
  try {
    const querySnapshot = await getDocs(collection(db, "revendas"))
    const revendas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    revenda = revendas.find((r: any) => slugify(r.nome) === slug);
  } catch (error) {
    console.error("Erro ao buscar revenda:", error)
  }

  if (!revenda) {
    notFound()
  }

  // 2. Fetch Produto
  const produto = await getProductBySlugAndLinha(linha, produtoSlug)
  
  if (!produto) {
    notFound()
  }

  const cleanPhone = revenda.telefone ? revenda.telefone.replace(/\D/g, '') : '';
  const productName = produto.nome || produto.title || 'Equipamento';
  const whatsappMsg = `Olá! Gostaria de um orçamento para o equipamento Macsport: ${productName}`;
  const whatsappUrl = cleanPhone ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}` : '#';
  
  // Format description
  const rawDescription = produto.descricao || produto.description || '';
  const descriptionLines = rawDescription
    ? rawDescription.split('. ').filter((line: string) => line.trim().length > 0) 
    : []

  const beneficios = Array.isArray(produto.beneficios) ? produto.beneficios : [];

  // Sugestões de produtos (pega 4 aleatórios ou primeiros)
  const allProducts = await getProducts()
  const sugestoes = allProducts.filter((p: any) => String(p.id) !== String(produto.id)).slice(0, 4)

  return (
    <main className="min-h-screen bg-background text-foreground pt-10 pb-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <Link href={`/revenda/${slug}`} className="inline-flex items-center text-text-muted hover:text-[#F5C400] transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} className="mr-2" />
          VOLTAR PARA A REVENDA
        </Link>

        {/* Produto Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Imagem do Produto */}
          <div className="relative bg-card-bg rounded-[2rem] p-8 flex items-center justify-center border border-border min-h-[400px] lg:min-h-[500px]">
            {(produto.imagem_url || produto.imageUrl) ? (
              <Image src={(produto.imagem_url || produto.imageUrl)} alt={productName} fill className="object-contain p-4" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            ) : (
              <div className="w-64 h-64 opacity-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-500">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
            )}
          </div>

          {/* Info do Produto */}
          <div className="flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-card-bg text-[#F5C400] text-xs font-bold tracking-wider rounded-full border border-border w-fit mb-4 uppercase">
              {produto.linha || produto.categoria || produto.subcategory || produto.category || 'Macsport'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{productName}</h1>
            <div className="text-text-muted mb-8 text-lg leading-relaxed">
              {descriptionLines.slice(0, 3).map((line: string, i: number) => (
                <p key={i} className="mb-2">{line}.</p>
              ))}
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-text-muted">
                <Check className="text-[#F5C400]" size={20} />
                <span>Código: {produto.codigo || produto.sku || 'N/A'}</span>
              </li>
              {beneficios.length > 0 ? (
                beneficios.map((beneficio: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-text-muted">
                    <Check className="text-[#F5C400]" size={20} />
                    <span>{beneficio}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-3 text-text-muted">
                  <Check className="text-[#F5C400]" size={20} />
                  <span>Alta Performance e Durabilidade</span>
                </li>
              )}
            </ul>

            {cleanPhone ? (
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full font-bold py-4 px-8 rounded-full text-lg transition-colors flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                SOLICITAR ORÇAMENTO À LOJA
              </a>
            ) : (
              <button disabled className="w-full font-bold py-4 px-8 rounded-full text-lg flex items-center justify-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed">
                Contato da Revenda Indisponível
              </button>
            )}

            <div className="mt-4 w-full">
              <ShareButton productName={productName} />
            </div>
          </div>
        </div>

        {/* Tabs de Detalhes */}
        <ProductTabs 
          descriptionLines={descriptionLines} 
          productName={productName} 
          pdfUrl={produto.pdf_url}
          comoUsarImg={produto.como_usar_img}
          productImage={produto.imagem_url || produto.imageUrl}
          productSku={produto.codigo || produto.sku || 'N/A'}
          productCategory={produto.linha || produto.categoria || produto.subcategory || produto.category || 'Macsport'}
        />

        {/* Google Maps Reviews */}
        <ReviewsSlider />

        {/* Produtos Sugeridos */}
        <div className="mt-20 pt-16 border-t border-border">
          <h2 className="text-3xl font-bold mb-10">Outros equipamentos desta revenda</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {sugestoes.map((item: any) => (
              <div key={item.id} className="bg-card-bg rounded-2xl overflow-hidden group flex flex-col h-full border border-border hover:border-[#F5C400] transition-colors relative shadow-sm">
                <Link href={`/revenda/${slug}/produto/${encodeURIComponent((item.linha || item.category || 'macsport').toLowerCase())}/${encodeURIComponent((item.nome || item.title || '').toLowerCase().replace(/ /g, '-'))}`} className="relative w-full h-40 md:h-48 bg-card-bg p-4 flex items-center justify-center block">
                  {(item.imagem_url || item.imageUrl) ? (
                    <Image src={(item.imagem_url || item.imageUrl)} alt={(item.nome || item.title) || 'Equipamento'} fill className="object-contain mix-blend-multiply p-2" sizes="(max-width: 768px) 50vw, 25vw" />
                  ) : (
                    <div className="w-16 h-16 opacity-50">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-500">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="p-3 md:p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <span className="text-[10px] md:text-xs text-[#F5C400] font-bold tracking-wider uppercase line-clamp-1">
                      Linha {item.linha || item.category || 'Macsport'}
                    </span>
                  </div>
                  <Link href={`/revenda/${slug}/produto/${encodeURIComponent((item.linha || item.category || 'macsport').toLowerCase())}/${encodeURIComponent((item.nome || item.title || '').toLowerCase().replace(/ /g, '-'))}`}>
                    <h3 className="text-sm md:text-base font-bold text-foreground mb-3 md:mb-4 line-clamp-2 leading-tight hover:text-[#F5C400] transition-colors">{(item.nome || item.title)}</h3>
                  </Link>
                  <div className="mt-auto pt-3 md:pt-4 border-t border-border">
                    <Link href={`/revenda/${slug}/produto/${encodeURIComponent((item.linha || item.category || 'macsport').toLowerCase())}/${encodeURIComponent((item.nome || item.title || '').toLowerCase().replace(/ /g, '-'))}`} className="block text-center w-full bg-transparent group-hover:bg-[#F5C400] text-[#F5C400] group-hover:text-black border border-[#F5C400] py-2 px-2 md:px-4 rounded-xl text-xs md:text-sm font-bold transition-colors">
                      VER DETALHES
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
