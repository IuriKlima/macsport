"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToImgBB } from "@/lib/imgbb";
import { Save, Image as ImageIcon } from "lucide-react";

export default function AdminQuemSomos() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const docRef = doc(db, "paginas", "quemsomos");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      console.error("Erro ao buscar dados da página:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      const imageUrl = await uploadToImgBB(file);
      setFormData(prev => ({ ...prev, hero_image: imageUrl }));
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      alert("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, "paginas", "quemsomos");
      await setDoc(docRef, formData, { merge: true });
      alert("Página atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar página:", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Carregando dados...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Página: Quem Somos</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção Principal (Hero) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Destaque Principal</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Principal (Fábrica)</label>
            <div className="flex items-center gap-4">
              {formData.hero_image && (
                <div className="w-32 h-20 rounded-lg overflow-hidden border">
                  <img src={formData.hero_image} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImg}
                />
                <button 
                  type="button"
                  className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon size={18} /> {uploadingImg ? "Enviando..." : "Alterar Imagem"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Destaque</label>
            <textarea 
              name="hero_text"
              value={formData.hero_text}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Bloco 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Bloco 1 (Vídeo)</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Bloco 1</label>
            <input 
              type="text" 
              name="block1_title"
              value={formData.block1_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link do Vídeo Institucional (YouTube Embed URL)</label>
            <input 
              type="text" 
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="Ex: https://www.youtube.com/embed/XXXXXX"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 1</label>
              <textarea 
                name="block1_text1"
                value={formData.block1_text1}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 2</label>
              <textarea 
                name="block1_text2"
                value={formData.block1_text2}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Bloco 2 (Qualidade)</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Bloco 2</label>
            <input 
              type="text" 
              name="block2_title"
              value={formData.block2_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 1</label>
              <textarea 
                name="block2_text1"
                value={formData.block2_text1}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 2</label>
              <textarea 
                name="block2_text2"
                value={formData.block2_text2}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Bloco 2</label>
            <div className="flex items-center gap-4">
              {formData.block2_img && (
                <div className="w-32 h-20 rounded-lg overflow-hidden border">
                  <img src={formData.block2_img} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImg(true);
                    try {
                      const imageUrl = await uploadToImgBB(file);
                      setFormData(prev => ({ ...prev, block2_img: imageUrl }));
                    } finally {
                      setUploadingImg(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImg}
                />
                <button 
                  type="button"
                  className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon size={18} /> {uploadingImg ? "Enviando..." : "Alterar Imagem"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Bloco 3 (Pesquisa)</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Bloco 3</label>
            <input 
              type="text" 
              name="block3_title"
              value={formData.block3_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 1</label>
              <textarea 
                name="block3_text1"
                value={formData.block3_text1}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parágrafo 2</label>
              <textarea 
                name="block3_text2"
                value={formData.block3_text2}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#F5C400] focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Bloco 3</label>
            <div className="flex items-center gap-4">
              {formData.block3_img && (
                <div className="w-32 h-20 rounded-lg overflow-hidden border">
                  <img src={formData.block3_img} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImg(true);
                    try {
                      const imageUrl = await uploadToImgBB(file);
                      setFormData(prev => ({ ...prev, block3_img: imageUrl }));
                    } finally {
                      setUploadingImg(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImg}
                />
                <button 
                  type="button"
                  className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon size={18} /> {uploadingImg ? "Enviando..." : "Alterar Imagem"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 4 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Bloco 4 (Performance)</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Bloco 4 (Performance)</label>
            <div className="flex items-center gap-4">
              {formData.block4_img && (
                <div className="w-32 h-20 rounded-lg overflow-hidden border">
                  <img src={formData.block4_img} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImg(true);
                    try {
                      const imageUrl = await uploadToImgBB(file);
                      setFormData(prev => ({ ...prev, block4_img: imageUrl }));
                    } finally {
                      setUploadingImg(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImg}
                />
                <button 
                  type="button"
                  className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon size={18} /> {uploadingImg ? "Enviando..." : "Alterar Imagem"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-3 rounded-full font-bold text-black bg-[#F5C400] hover:bg-[#e0b400] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? "Salvando Alterações..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
