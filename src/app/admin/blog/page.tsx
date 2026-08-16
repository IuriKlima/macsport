"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { uploadToImgBB } from "@/lib/imgbb";
import { Plus, Pencil, Trash2, X, Check, Image as ImageIcon, Database, BookOpen } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    categoria: "",
    autor: "Equipe Macsport",
    imagem: "",
    conteudo: "", // opcional se não tiver post interno
  });

  const MOCK_POSTS = [
    {
      titulo: 'Como escolher equipamentos para montar uma academia',
      resumo: 'Descubra os principais fatores estruturais, biomecânicos e financeiros para tomar a melhor decisão.',
      conteudo: 'Conteúdo completo aqui...',
      autor: 'Equipe Macsport',
      categoria: 'Como montar uma academia',
      imagem: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    },
    {
      titulo: 'Musculação, cardio e peso livre: como distribuir o espaço',
      resumo: 'Aprenda a criar um fluxo de treino eficiente e seguro na sua academia.',
      conteudo: 'Conteúdo completo aqui...',
      autor: 'Equipe Macsport',
      categoria: 'Gestão e operação',
      imagem: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    }
  ];

  const loadPosts = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "blog"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data.reverse());
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openModal = (post?: any) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        titulo: post.titulo || "",
        resumo: post.resumo || "",
        categoria: post.categoria || "",
        autor: post.autor || "Equipe Macsport",
        imagem: post.imagem || "",
        conteudo: post.conteudo || "",
      });
    } else {
      setEditingPost(null);
      setFormData({
        titulo: "",
        resumo: "",
        categoria: "",
        autor: "Equipe Macsport",
        imagem: "",
        conteudo: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);
      try {
        const url = await uploadToImgBB(file);
        setFormData(prev => ({ ...prev, imagem: url }));
      } catch (err) {
        console.error("Erro ao fazer upload:", err);
        alert("Falha ao enviar a imagem.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPost) {
        const postRef = doc(db, "blog", editingPost.id);
        await updateDoc(postRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "blog"), {
          ...formData,
          createdAt: serverTimestamp(),
          data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        });
      }
      setIsModalOpen(false);
      loadPosts();
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao salvar a publicação.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta publicação?")) {
      try {
        await deleteDoc(doc(db, "blog", id));
        loadPosts();
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir.");
      }
    }
  };

  const seedDatabase = async () => {
    setLoading(true);
    try {
      for (const post of MOCK_POSTS) {
        await addDoc(collection(db, "blog"), { ...post, createdAt: serverTimestamp(), data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) });
      }
      loadPosts();
    } catch (err) {
      console.error(err);
      alert("Erro ao popular banco.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500">Gerencie as publicações do site</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#F5C400] text-black px-6 py-2.5 rounded font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Nova Publicação
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Imagem</th>
                <th className="p-4 font-semibold">Título</th>
                <th className="p-4 font-semibold">Categoria</th>
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <BookOpen size={48} className="text-gray-300 mb-4" />
                      <p className="mb-4">Nenhuma publicação encontrada no banco de dados.</p>
                      <button onClick={seedDatabase} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Database size={18} /> Popular com Publicações de Teste
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {post.imagem ? (
                        <img src={post.imagem} alt="Capa" className="w-16 h-12 object-cover rounded shadow-sm" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{post.titulo}</div>
                      <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{post.resumo}</div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold">{post.categoria}</span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{post.data || "N/A"}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(post)} className="text-blue-600 hover:text-blue-800 p-2" title="Editar">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800 p-2 ml-2" title="Excluir">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingPost ? "Editar Publicação" : "Nova Publicação"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                    <input 
                      required type="text" 
                      value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#F5C400]"
                      placeholder="Ex: A importância da manutenção..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria *</label>
                    <input 
                      required type="text" 
                      value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#F5C400]"
                      placeholder="Ex: Manutenção, Tendências..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Autor</label>
                    <input 
                      type="text" 
                      value={formData.autor} onChange={e => setFormData({...formData, autor: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#F5C400]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem de Capa</label>
                    
                    {formData.imagem ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={formData.imagem} alt="Capa" className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <label className="cursor-pointer text-white flex flex-col items-center">
                             <ImageIcon size={24} className="mb-1" />
                             <span className="text-sm font-medium">Trocar Imagem</span>
                             <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                           </label>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        {uploadingImage ? (
                          <span className="text-gray-500 font-medium">Enviando...</span>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center text-gray-500 w-full h-full justify-center">
                            <ImageIcon size={32} className="mb-2 text-gray-400" />
                            <span className="text-sm font-medium">Clique para enviar uma imagem</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Resumo (Card) *</label>
                    <textarea 
                      required rows={3}
                      value={formData.resumo} onChange={e => setFormData({...formData, resumo: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#F5C400]"
                      placeholder="Breve descrição para aparecer no grid..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Conteúdo Completo (Opcional)</label>
                <textarea 
                  rows={5}
                  value={formData.conteudo} onChange={e => setFormData({...formData, conteudo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#F5C400]"
                  placeholder="Texto completo do artigo..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading || uploadingImage}
                  className="bg-black text-[#F5C400] px-8 py-2.5 rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? "Salvando..." : (
                    <>
                      <Check size={20} />
                      Salvar Publicação
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
