"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToImgBB } from "@/lib/imgbb";
import { Trash2, Edit2, Plus, GripVertical, Upload } from "lucide-react";

export default function AdminSlides() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    image: "",
    imageMobile: "",
    title: "",
    subtitle: "",
    description: "",
    tag: "",
    link: "",
    order: 0
  });

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "slides"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => a.order - b.order);
      setSlides(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateDoc(doc(db, "slides", formData.id), {
          image: formData.image || "",
          imageMobile: formData.imageMobile || "",
          title: formData.title || "",
          subtitle: formData.subtitle || "",
          description: formData.description || "",
          tag: formData.tag || "",
          link: formData.link || "",
          order: Number(formData.order) || 0
        });
      } else {
        await addDoc(collection(db, "slides"), {
          image: formData.image || "",
          imageMobile: formData.imageMobile || "",
          title: formData.title || "",
          subtitle: formData.subtitle || "",
          description: formData.description || "",
          tag: formData.tag || "",
          link: formData.link || "",
          order: Number(formData.order) || 0
        });
      }
      setIsEditing(false);
      setFormData({ id: "", image: "", imageMobile: "", title: "", subtitle: "", description: "", tag: "", link: "", order: 0 });
      fetchSlides();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este slide?")) {
      await deleteDoc(doc(db, "slides", id));
      fetchSlides();
    }
  };

  const handleEdit = (slide: any) => {
    setFormData(slide);
    setIsEditing(true);
  };

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>, slide: any, type: 'image' | 'imageMobile') => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const url = await uploadToImgBB(e.target.files[0]);
        await updateDoc(doc(db, "slides", slide.id), {
          [type]: url
        });
        fetchSlides();
      } catch (err) {
        console.error(err);
        alert("Erro ao enviar a imagem. Tente novamente.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Slides (Banners)</h1>
        <button 
          onClick={() => {
            setFormData({ id: "", image: "", imageMobile: "", title: "", subtitle: "", description: "", tag: "", link: "", order: slides.length });
            setIsEditing(true);
          }}
          className="bg-[#F5C400] text-black font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition-colors"
        >
          <Plus size={20} /> Novo Slide
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded shadow border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">{formData.id ? "Editar Slide" : "Novo Slide"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem Desktop</label>
                <div className="flex gap-2">
                  <input required type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 border rounded px-3 py-2 outline-none focus:border-[#F5C400]" placeholder="URL ou faça upload" />
                  <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-2 rounded flex items-center justify-center border border-gray-300">
                    <Upload size={18} className="text-gray-600" />
                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadingImage(true);
                        try {
                          const url = await uploadToImgBB(e.target.files[0]);
                          setFormData(prev => ({...prev, image: url}));
                        } catch(err) { alert("Erro ao fazer upload"); }
                        setUploadingImage(false);
                      }
                    }} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem Mobile (Opcional)</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.imageMobile} onChange={(e) => setFormData({...formData, imageMobile: e.target.value})} className="flex-1 border rounded px-3 py-2 outline-none focus:border-[#F5C400]" placeholder="URL ou faça upload" />
                  <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-2 rounded flex items-center justify-center border border-gray-300">
                    <Upload size={18} className="text-gray-600" />
                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadingImage(true);
                        try {
                          const url = await uploadToImgBB(e.target.files[0]);
                          setFormData(prev => ({...prev, imageMobile: url}));
                        } catch(err) { alert("Erro ao fazer upload"); }
                        setUploadingImage(false);
                      }
                    }} />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded px-3 py-2 outline-none focus:border-[#F5C400]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo (Amarelo)</label>
                <input required type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full border rounded px-3 py-2 outline-none focus:border-[#F5C400]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Ex: LANÇAMENTO)</label>
                <input type="text" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full border rounded px-3 py-2 outline-none focus:border-[#F5C400]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Redirecionamento (Opcional)</label>
                <input type="text" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full border rounded px-3 py-2 outline-none focus:border-[#F5C400]" placeholder="Ex: /equipamentos?linha=Uranos" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded px-3 py-2 outline-none focus:border-[#F5C400]" rows={3}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordem (Posição)</label>
                <input required type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="w-full border rounded px-3 py-2 outline-none focus:border-[#F5C400]" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={uploadingImage} className="bg-[#F5C400] text-black px-6 py-2 rounded font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
                {uploadingImage ? "Aguarde..." : "Salvar Slide"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-black px-6 py-2 rounded font-bold hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando slides...</div>
          ) : slides.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum slide cadastrado. O site mostrará os banners padrão.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {slides.map((slide) => (
                <li key={slide.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="text-gray-400 cursor-move"><GripVertical size={20} /></div>
                  
                  <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-xs text-gray-500 relative group cursor-pointer border border-dashed border-gray-300 hover:border-[#F5C400] transition-colors">
                    {slide.image ? <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" /> : <Upload size={20} className="text-gray-400 group-hover:opacity-40" />}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <span className="text-white text-[10px] font-bold px-1 text-center leading-tight">Trocar<br/>Foto</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      title="Clique para alterar a foto do Desktop"
                      onChange={(e) => handleQuickUpload(e, slide, 'image')}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{slide.title}</h3>
                    <p className="text-sm text-gray-500">{slide.subtitle}</p>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 mt-1 inline-block">Ordem: {slide.order}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(slide.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
