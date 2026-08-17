import { getPostById, getPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ChevronLeft } from "lucide-react";
import type { Metadata } from 'next';
import xss from 'xss';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostById(resolvedParams.id);
  if (!post) {
    return {
      title: 'Post Não Encontrado | Macsport'
    };
  }

  return {
    title: `${post.titulo} | Macsport Blog`,
    description: post.resumo,
    openGraph: {
      title: `${post.titulo} | Macsport`,
      description: post.resumo,
      images: post.imagem ? [post.imagem] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = await getPostById(resolvedParams.id);
  const allPosts = await getPosts();
  const relatedPosts = allPosts.filter((p: any) => p.id.toString() !== post?.id?.toString() && p.slug !== post?.slug).slice(0, 3);

  if (!post) {
    notFound();
  }

  // To display rich text content safely, we could use dangerouslySetInnerHTML if we had rich text.
  // For now, we assume post.conteudo exists, or we fallback to resumo.
  
  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-text-muted hover:text-[#F5C400] transition-colors mb-8 font-medium">
          <ChevronLeft size={20} />
          Voltar para o Blog
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna Principal */}
          <div className="w-full lg:w-3/4">
            <article className="bg-card-bg rounded-t-3xl rounded-b-none border border-border overflow-hidden shadow-sm">
              {post.imagem && (
                <div className="w-full h-[400px] md:h-[500px] relative">
                  <img src={post.imagem} alt={post.titulo} className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6 bg-[#F5C400] text-black px-4 py-1 text-sm font-bold uppercase rounded-t-3xl rounded-b-none shadow-md">
                    {post.categoria}
                  </div>
                </div>
              )}
              
              <div className="p-8 md:p-12">
                {!post.imagem && (
                  <div className="bg-[#F5C400]/20 text-[#F5C400] px-4 py-1 text-sm font-bold uppercase rounded-t-3xl rounded-b-none w-fit mb-6 inline-block border border-[#F5C400]/50">
                    {post.categoria}
                  </div>
                )}
                
                <h1 className="text-3xl md:text-5xl font-bold mb-8 text-foreground leading-tight">
                  {post.titulo}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border mb-8 text-text-muted font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#F5C400]" />
                    {post.data}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-[#F5C400]" />
                    {post.autor}
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none text-text-muted">
                  {post.conteudo ? (
                    // Use dangerouslySetInnerHTML se o conteúdo vier de um editor WYSIWYG
                    <div dangerouslySetInnerHTML={{ __html: xss(post.conteudo) }} className="text-lg leading-relaxed text-text-muted [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-8 [&>h3]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>li]:mb-2" />
                  ) : (
                    <>
                      <p className="text-xl font-medium text-foreground mb-8 italic border-l-4 border-[#F5C400] pl-6 py-2 bg-[#F5C400]/5 rounded-r-xl">
                        {post.resumo}
                      </p>
                      <p className="mb-6 text-lg leading-relaxed">
                        Conteúdo do post em breve.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar - Widget de Anúncio */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-28 space-y-6">
              {/* Widget 1 */}
              <div className="bg-card-bg rounded-[2rem] border border-border p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-4">Procurando Equipamentos?</h3>
                <p className="text-text-muted mb-6 text-sm">Conheça nossas linhas completas com a melhor biomecânica do mercado para sua academia.</p>
                <div className="bg-background rounded-2xl overflow-hidden mb-6 h-40 flex items-center justify-center">
                  <img src="/Banner Uranos.png" alt="Anúncio Equipamentos" className="w-full h-full object-cover opacity-80" />
                </div>
                <Link href="/equipamentos" className="block w-full bg-[#F5C400] text-black font-bold py-3 px-4 rounded-full hover:bg-yellow-500 transition-colors">
                  Ver Catálogo
                </Link>
              </div>

              {/* Widget 2 */}
              <div className="bg-gradient-to-br from-black to-[#222] border border-[#F5C400]/30 rounded-[2rem] p-6 text-center">
                <h3 className="text-xl font-bold text-[#F5C400] mb-4">Monte sua Academia</h3>
                <p className="text-gray-300 mb-6 text-sm">Fale com nossos especialistas e solicite um projeto 3D gratuito.</p>
                <Link href="/orcamento" className="block w-full bg-transparent border-2 border-[#F5C400] text-[#F5C400] font-bold py-3 px-4 rounded-full hover:bg-[#F5C400] hover:text-black transition-colors">
                  Solicitar Orçamento
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Veja também */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Veja também</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost: any) => (
                <Link href={`/blog/${rPost.slug || rPost.id}`} key={rPost.id} className="group">
                  <div className="bg-card-bg rounded-[2rem] border border-border overflow-hidden h-full flex flex-col hover:border-[#F5C400] transition-colors">
                    {rPost.imagem ? (
                      <div className="h-48 w-full overflow-hidden">
                        <img src={rPost.imagem} alt={rPost.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-background flex items-center justify-center">
                        <span className="text-[#F5C400] font-bold uppercase">{rPost.categoria}</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs text-[#F5C400] font-bold uppercase mb-2">{rPost.categoria}</span>
                      <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-[#F5C400] transition-colors">{rPost.titulo}</h3>
                      <p className="text-text-muted text-sm line-clamp-3 mb-4 flex-grow">{rPost.resumo}</p>
                      <div className="flex items-center justify-between text-xs text-text-muted mt-auto pt-4 border-t border-border">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {rPost.data}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
