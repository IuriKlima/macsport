import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getProducts } from "@/lib/products";
import { getPosts } from "@/lib/blog";
import { BannerSlider } from "@/components/BannerSlider";
import { HomeProductShowcase } from "@/components/HomeProductShowcase";
import ReviewsSlider from "@/components/ReviewsSlider";
import { WhatsAppBanner } from "@/components/WhatsAppBanner";

export const revalidate = 60; // ISR for Firebase

export default async function Home() {
  const products = await getProducts();
  const allPosts = await getPosts();
  const topPosts = allPosts.slice(0, 3);
  
  let initialBanners: any[] = [];
  try {
    const snap = await getDocs(collection(db, "slides"));
    if (!snap.empty) {
      initialBanners = snap.docs.map(d => d.data()).sort((a: any, b: any) => a.order - b.order);
    }
  } catch (err) {
    console.error("Failed to load slides on server", err);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Banners Section */}
      <section className="w-full flex flex-col">
        <BannerSlider initialBanners={initialBanners} />
      </section>

      {/* Products Grid Container */}
      <section id="produtos" className="w-full bg-background pt-16 pb-8 md:pt-24 md:pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" data-aos="fade-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossa Linha de <span className="text-macsport">Equipamentos</span>
              </h2>
              <p className="text-text-muted max-w-xl">
                Soluções robustas projetadas para entregar o máximo de eficiência em sua operação diária.
              </p>
            </div>
            
            <Link 
              href="/equipamentos" 
              className="text-foreground hover:text-macsport font-medium transition-colors flex items-center gap-2"
            >
              Ver todos os equipamentos
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="200">
            <HomeProductShowcase products={products} />
          </div>
        </div>
      </section>
      


      {/* Seção — Avaliações / Testimonials */}
      <section className="w-full bg-background py-8 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto" data-aos="fade-up">
          <ReviewsSlider />
        </div>
      </section>

      {/* Seção — Blog */}
      <section className="w-full bg-card-bg py-16 md:py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" data-aos="fade-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Últimas do <span className="text-macsport">Blog</span>
              </h2>
              <p className="text-text-muted max-w-xl">
                Dicas de gestão, novidades do mercado fitness e conteúdos exclusivos sobre performance e saúde.
              </p>
            </div>
            
            <Link 
              href="/blog" 
              className="text-foreground hover:text-macsport font-medium transition-colors flex items-center gap-2"
            >
              Acessar o blog completo
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topPosts.map((post: any, index: number) => (
              <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="group cursor-pointer block" data-aos="fade-up" data-aos-delay={index * 100}>
                <article>
                  <div className="w-full h-56 bg-gray-200 rounded-[2rem] overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                    {post.imagem ? (
                      <Image src={post.imagem} alt={post.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 text-[#F5C400]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
                      </div>
                    )}
                  </div>
                  <span className="text-macsport text-xs font-bold tracking-wider uppercase mb-2 block">{post.categoria}</span>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-macsport transition-colors line-clamp-2">{post.titulo}</h3>
                  <p className="text-text-muted text-sm line-clamp-2">{post.resumo}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Banner Section */}
      <WhatsAppBanner />

      {/* Faixa de Diferenciais */}
      <section className="w-full bg-graphite border-y border-gray-800 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
          <div className="p-4" data-aos="fade-up" data-aos-delay="0">
            <h4 className="text-foreground font-bold text-xl mb-2">Fabricação nacional</h4>
            <p className="text-text-muted text-sm">Equipamentos desenvolvidos e fabricados no Brasil.</p>
          </div>
          <div className="p-4 pt-8 md:pt-4" data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-foreground font-bold text-xl mb-2">Engenharia que entrega desempenho</h4>
            <p className="text-text-muted text-sm">Projetos pensados para oferecer estabilidade.</p>
          </div>
          <div className="p-4 pt-8 md:pt-4" data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-foreground font-bold text-xl mb-2">Atendimento especializado</h4>
            <p className="text-text-muted text-sm">Do primeiro contato ao pós-venda.</p>
          </div>
          <div className="p-4 pt-8 md:pt-4" data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-foreground font-bold text-xl mb-2">Assistência técnica</h4>
            <p className="text-text-muted text-sm">Suporte para manter seus equipamentos.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
