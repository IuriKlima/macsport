"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const DEFAULT_POSTS = [
  {
    id: 1,
    titulo: 'Como escolher equipamentos para montar uma academia',
    resumo: 'Descubra os principais fatores estruturais, biomecânicos e financeiros para tomar a melhor decisão na hora de equipar seu novo espaço fitness.',
    data: '12 Ago 2026',
    autor: 'Equipe Macsport',
    categoria: 'Institucional',
    imagem: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 2,
    titulo: 'Musculação, cardio e peso livre: como distribuir o espaço',
    resumo: 'Aprenda a criar um fluxo de treino eficiente e seguro na sua academia, otimizando o m² e melhorando a experiência dos seus alunos.',
    data: '05 Ago 2026',
    autor: 'Equipe Macsport',
    categoria: 'Esportes',
    imagem: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 3,
    titulo: 'Diferenças entre as linhas Macsport',
    resumo: 'Uranos, Sigma, Evo, New Evo ou Peso Livre? Entenda qual linha de equipamentos é a mais indicada para o perfil do seu projeto comercial.',
    data: '28 Jul 2026',
    autor: 'Macsport News',
    categoria: 'Produtos',
    imagem: '/Banner Uranos.png',
  },
];

export default function BlogClient() {
  const [posts, setPosts] = useState<any[]>(DEFAULT_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const snap = await getDocs(collection(db, "blog"));
        if (!snap.empty) {
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // @ts-ignore
          setPosts(data.reverse());
        }
      } catch (err) {
        console.error("Erro ao carregar blog", err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.length > 1 ? posts.slice(1, 4) : [];
  
  // Agrupar posts por categoria (ignorando os já mostrados como destaque e recentes se quiser, mas aqui vamos listar todos)
  const categoriesMap: Record<string, any[]> = {};
  
  posts.forEach(post => {
    const cat = post.categoria || "Geral";
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(post);
  });

  const categories = Object.keys(categoriesMap);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-gray-900 pb-16">
      {/* Header Section (Yellow) */}
      <section className="bg-[#F5C400] pt-32 pb-48 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm font-medium mb-8 text-black/70">
            <Link href="/" className="hover:text-black flex items-center gap-1">
              &lt; Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black font-bold">Notícias</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-black">
            Notícias
          </h1>
          <p className="text-xl text-black/80 font-medium max-w-3xl">
            Aqui você fica por dentro das últimas novidades sobre a Macsport, o mercado fitness e nossas ações nas áreas de saúde e esportes. Acompanhe as nossas notícias para se manter atualizado.
          </p>
        </div>
      </section>

      {/* Recentes - Overlapping */}
      <section className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-6">
             <div className="w-1/2"></div> {/* Espaço para alinhar Recentes */}
             <div className="w-1/2 pl-8 hidden lg:block">
               <h2 className="text-3xl font-light text-black">Recentes</h2>
             </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Featured Left */}
            {featuredPost && (
              <div className="w-full lg:w-7/12">
                <Link href={`/blog/${featuredPost.id}`} className="bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col h-full group hover:shadow-2xl transition-shadow cursor-pointer block">
                  <div className="relative h-64 md:h-[350px] w-full overflow-hidden">
                    <img src={featuredPost.imagem || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80"} alt={featuredPost.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-6 left-6 bg-[#F5C400] text-black px-4 py-1 text-xs font-bold uppercase rounded-full shadow-md">
                      Destaque
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <h3 className="text-3xl font-light mb-4 text-gray-900 group-hover:text-[#F5C400] transition-colors leading-tight">{featuredPost.titulo}</h3>
                    <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed">{featuredPost.resumo}</p>
                    <div className="text-xs text-gray-400 mt-auto font-medium">
                      Tempo de leitura: 3 mins
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Recentes Right (List) */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6">
              <h2 className="text-3xl font-light text-black mb-2 lg:hidden">Recentes</h2>
              {recentPosts.map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-md flex flex-row h-32 md:h-40 group hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-2/5 h-full relative overflow-hidden flex-shrink-0">
                    <img src={post.imagem || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80"} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="w-3/5 p-4 md:p-6 flex flex-col justify-center">
                    <div className="inline-block bg-[#F5C400]/20 text-[#F5C400] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-fit mb-2">
                      {post.categoria || "Novidade"}
                    </div>
                    <h4 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 group-hover:text-[#F5C400] transition-colors mb-2 leading-tight">
                      {post.titulo}
                    </h4>
                    <div className="text-xs text-gray-400 mt-auto font-medium">
                      Tempo de leitura: 2 mins
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorias / Secoes */}
      {categories.map((cat, idx) => {
        const catPosts = categoriesMap[cat].slice(0, 3); // show up to 3 for the row
        if (catPosts.length === 0) return null;
        
        return (
          <section key={idx} className="px-4 md:px-8 lg:px-16 py-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8 border-t border-gray-200 pt-10">
                <h2 className="text-3xl font-light text-gray-900">{cat}</h2>
                <button className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors font-medium text-sm">
                  Ver todas <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {catPosts.map((post: any, i: number) => {
                  return (
                    <Link href={`/blog/${post.id}`} key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-md flex flex-col group hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="h-48 relative overflow-hidden">
                        <img src={post.imagem || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80"} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <h3 className="text-xl font-light text-gray-900 mb-3 group-hover:text-[#F5C400] transition-colors line-clamp-2 leading-tight">
                          {post.titulo}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                          {post.resumo}
                        </p>
                        <div className="text-xs text-gray-400 mt-auto pt-4 font-medium">
                          Tempo de leitura: 3 mins
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        );
      })}

    </main>
  );
}
