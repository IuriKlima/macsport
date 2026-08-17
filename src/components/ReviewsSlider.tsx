"use client"

import { useRef } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const reviews = [
  { nome: "Celeste Teixeira", review: "Comprei toda a minha academia em 2024 e escolhi os equipamentos da Mac SPORT por indicação da Viva Mais Fitness, que nos deu todo o suporte desde o primeiro contato. Foi através deles que conhecemos a marca..." },
  { nome: "Alex da Academia", review: "Excelente experiência! Atendimento diferenciado, equipe atenciosa e extremamente profissional. Os equipamentos são de altíssima qualidade, robustos e com acabamento impecável. Além disso, a entrega foi rápida e muito bem organizada. Empresa séria, comprometida e que realmente cumpre o que promete. Recomendo sem dúvida!" },
  { nome: "Maria Fernanda", review: "Recomendo a empresa com total confiança. São nossos parceiros e sempre trabalharam com eficiência, compromisso e transparência. Deixo aqui meu agradecimento especial ao senhor Rubens, que sempre me oferece..." },
  { nome: "Farley Aquino", review: "Somos parceiros da Macsport há 10 anos, e ao longo dessa trajetória construímos uma relação baseada em confiança, qualidade e eficiência. O atendimento sempre foi ágil e comprometido, e quando precisamos de ajuda ou suporte, podemos contar..." },
  { nome: "Marcelo MS", review: "Gostaria de registrar minha satisfação com a experiência que tive com a Macsport. Desde o primeiro contato, fui atendido com atenção, cordialidade e profissionalismo, recebendo todas as informações necessárias para escolher o aparelho..." },
  { nome: "Italo Fonseca", review: "Empresa competente com equipamentos nacionais de excelente qualidade, tenho hoje 2 salas completas onde todas as máquinas são de fabricação deles." },
  { nome: "Gabriel Taiar", review: "Empresa nacional e que entrega ótima qualidade, seja nos aparelhos quanto no atendimento. Recomendo de olhos fechados!!!" },
  { nome: "Leandro Moscon", review: "Super satisfeito, sempre que preciso adquirir os equipamentos da Mac sport ou da Alfa sou bem atendido, entrega é sempre pontual, e os equipamentos são de excelente qualidade." },
  { nome: "Antonio Carvalho Tom", review: "Tenho parceria com a Mac há anos e sempre tive ótima experiência. Empresa séria, confiável, com ótimo atendimento e prazos. Recomendo! 💪" },
  { nome: "Darlan Zanrosso", review: "Conheço a Mac Sport há muitos anos, empresa sólida e confiável com excelente atendimento. Sou sempre muito bem atendido pelo senhor Rubens." },
];

export default function ReviewsSlider() {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 350 // Approximate width of one card + gap
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="mt-20 pt-16 border-t border-border relative">
      <div className="flex items-center gap-3 mb-10 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">O que nossos clientes dizem</h2>
          <div className="flex bg-white border border-gray-200 px-3 py-1 rounded-full text-black text-sm font-bold gap-1 items-center shadow-sm">
            <span className="font-bold tracking-tight">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span> 
            <Star size={14} className="text-yellow-500 fill-yellow-500 ml-1" /> 5.0
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-card-bg hover:bg-[#F5C400] text-foreground hover:text-background flex items-center justify-center transition-colors border border-border"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-card-bg hover:bg-[#F5C400] text-foreground hover:text-background flex items-center justify-center transition-colors border border-border"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={sliderRef}
        className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((dep, idx) => (
          <div 
            key={idx} 
            className="min-w-[300px] md:min-w-[350px] max-w-[350px] bg-card-bg p-6 rounded-[2rem] border border-border snap-start flex flex-col"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-[#F5C400] fill-[#F5C400]" />)}
            </div>
            <p className="text-text-muted mb-6 italic flex-grow text-sm leading-relaxed">"{dep.review}"</p>
            <div className="font-bold text-foreground text-sm mt-auto">— {dep.nome}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
