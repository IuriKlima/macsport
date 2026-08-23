import { Factory, Award, Users, Target, Play, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Quem Somos',
  description: 'Conheça a Macsport: fabricante brasileiro de equipamentos profissionais para academias. Engenharia nacional, inovação e qualidade.',
  openGraph: {
    title: 'Quem Somos',
    description: 'Conheça a Macsport: fabricante brasileiro de equipamentos profissionais para academias. Engenharia nacional, inovação e qualidade.',
  },
}

export default async function QuemSomosPage() {
  let content = {
    hero_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    hero_text: "A Macsport é uma das maiores e mais completas indústrias de equipamentos fitness do país. Com uma linha de produção moderna e verticalizada, garantimos qualidade extrema, desde a matéria-prima até a entrega na sua academia.",
    block1_title: "A Macsport",
    block1_text1: "O alto padrão de qualidade, aliado à resistência dos nossos produtos, tem feito da Macsport uma das empresas do setor de maior crescimento na última década. Rompendo os paradigmas do mercado, somos líderes em inovação constante.",
    block1_text2: "Nossa matriz está localizada em São Paulo, de onde distribuímos para todo o Brasil. Recentemente, expandimos nossa capacidade de produção, projetando um crescimento ainda maior para os próximos anos.",
    video_url: "https://www.youtube.com/embed/GAfsr79dwF4?start=15",
    block2_title: "Qualidade",
    block2_text1: "A qualidade Macsport é reconhecida por empresários do setor fitness e atestada por rígidos controles. Utilizamos apenas matérias-primas certificadas, garantindo durabilidade extrema e baixo custo de manutenção.",
    block2_text2: "Mantemos um rígido controle de qualidade em cada etapa de produção, do recebimento de insumos, passando pelas linhas de solda robotizada, até a montagem final.",
    block2_img: "https://images.unsplash.com/photo-1563810168393-018317a7c067?q=80&w=2070&auto=format&fit=crop",
    block3_title: "Pesquisa e Desenvolvimento",
    block3_text1: "Investimos continuamente em pesquisa para desenvolver novos equipamentos e aprimorar os atuais. Nossa equipe de engenharia utiliza softwares avançados de simulação estrutural e biomecânica.",
    block3_text2: "Cada angulação e eixo de rotação é milimetricamente calculado para o máximo recrutamento muscular, oferecendo segurança total ao usuário e fluidez durante o exercício.",
    block3_img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=2070&auto=format&fit=crop",
    block4_img: "/Banner Uranos.png",
  };

  try {
    const docSnap = await getDoc(doc(db, "paginas", "quemsomos"));
    if (docSnap.exists()) {
      content = { ...content, ...docSnap.data() };
    }
  } catch (error) {
    console.error("Erro ao carregar conteúdo:", error);
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 pb-0">
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
            <span className="text-[#F5C400] font-bold">Conheça a Mac</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Conheça a Mac
          </h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl">
            A força da indústria brasileira a serviço do <span className="text-[#F5C400]">movimento e performance</span>.
          </p>
        </div>
      </section>

      {/* Hero Image overlapping */}
      <section className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10 mb-20" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-[300px] md:h-[500px] bg-gray-200 rounded-[2rem] overflow-hidden shadow-2xl relative">
            <img 
              src={content.hero_image} 
              alt="Fábrica Macsport" 
              className="w-full h-full object-cover"
            />
            {/* Logo watermark */}
            <div className="absolute bottom-8 right-8 bg-[#F5C400] rounded-full w-24 h-24 flex items-center justify-center p-4 shadow-lg transform rotate-12">
              <span className="font-black text-black text-xl tracking-tighter">MACSPORT</span>
            </div>
          </div>
          
          <div className="mt-8 text-gray-600 text-lg leading-relaxed max-w-4xl">
            {content.hero_text}
          </div>
        </div>
      </section>

      {/* Alternating Blocks */}
      <section className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Block 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 overflow-hidden">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <h2 className="text-3xl font-light mb-6 text-gray-900">{content.block1_title}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {content.block1_text1}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {content.block1_text2}
              </p>
            </div>
            <div className="w-full md:w-1/2 relative" data-aos="fade-left">
              <div className="block aspect-video bg-gray-900 rounded-[2rem] overflow-hidden relative shadow-xl">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={content.video_url} 
                  title="Video Institucional Macsport" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Block 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 overflow-hidden">
            <div className="w-full md:w-1/2" data-aos="fade-left">
              <h2 className="text-3xl font-light mb-6 text-gray-900">{content.block2_title}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {content.block2_text1}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {content.block2_text2}
              </p>
            </div>
            <div className="w-full md:w-1/2 relative" data-aos="fade-right">
              <div className="aspect-[4/3] bg-gray-200 rounded-[2rem] overflow-hidden shadow-xl">
                <img src={content.block2_img} alt="Qualidade" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Block 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 overflow-hidden">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <h2 className="text-3xl font-light mb-6 text-gray-900">{content.block3_title}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {content.block3_text1}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {content.block3_text2}
              </p>
            </div>
            <div className="w-full md:w-1/2 relative" data-aos="fade-left">
              <div className="aspect-[4/3] bg-gray-200 rounded-[2rem] overflow-hidden shadow-xl">
                <img src={content.block3_img} alt="Pesquisa" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Block 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 pb-12 overflow-hidden">
            <div className="w-full md:w-1/2" data-aos="fade-left">
              <h2 className="text-3xl font-light mb-6 text-gray-900">Performance em todos os sentidos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Somos uma empresa que fornece soluções completas para a sua academia. Conheça algumas das nossas linhas de destaque:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li><strong className="text-gray-900">New Evo:</strong> Design arrojado e biomecânica perfeita.</li>
                <li><strong className="text-gray-900">Uranos:</strong> Robustez extrema para treinos de alta intensidade.</li>
                <li><strong className="text-gray-900">Sigma:</strong> O custo-benefício ideal com alta durabilidade.</li>
                <li><strong className="text-gray-900">Peso Livre:</strong> Estruturas maciças para fisiculturismo.</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 relative" data-aos="fade-right">
              <div className="aspect-[4/3] bg-gray-200 rounded-[2rem] overflow-hidden shadow-xl relative">
                <img src={content.block4_img} alt="Performance" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="absolute bottom-6 left-6 text-white font-bold text-2xl tracking-widest uppercase">MACSPORT</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
