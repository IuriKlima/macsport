"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToImgBB } from "@/lib/imgbb";
import { Trash2, Edit2, Plus, ArrowLeft, Upload, Search, Filter, Copy, FileSpreadsheet } from "lucide-react";
import Papa from "papaparse";

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLinha, setFilterLinha] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [massEditLinha, setMassEditLinha] = useState("");
  const [massEditCategoria, setMassEditCategoria] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    title: "",
    linha: "",
    categoria: "",
    imagem_url: "",
    descricao: "",
    beneficios: "",
    pdf_url: "",
    como_usar_img: "",
    oculto: false
  });

  const [linhasDisponiveis, setLinhasDisponiveis] = useState<string[]>([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<string[]>([]);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "produtos"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(data);
      
      const linhasUnicas = Array.from(new Set(data.map((p: any) => p.linha || p.category))).filter(Boolean) as string[];
      const categoriasUnicas = Array.from(new Set(data.map((p: any) => p.categoria || p.subcategory))).filter(Boolean) as string[];
      
      setLinhasDisponiveis(Array.from(new Set([...linhasUnicas, "Uranos", "New Evo", "Sigma", "Evo", "Cromus", "Peso Livre", "Estações", "Strong", "Select", "Cardio", "Macsport"])).sort());
      setCategoriasDisponiveis(Array.from(new Set([...categoriasUnicas, "Musculação", "Cardio", "Peso Livre", "Acessórios", "Estações"])).sort());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize data for consistency
    const dataToSave = {
      nome: formData.nome,
      title: formData.nome, // keep title for retro-compatibility
      linha: formData.linha,
      categoria: formData.categoria,
      imagem_url: formData.imagem_url,
      imageUrl: formData.imagem_url, // retro-compatibility
      descricao: formData.descricao,
      beneficios: formData.beneficios.split('\n').filter(b => b.trim() !== ''),
      pdf_url: formData.pdf_url,
      como_usar_img: formData.como_usar_img,
      oculto: formData.oculto
    };

    try {
      if (formData.id) {
        await updateDoc(doc(db, "produtos", formData.id), dataToSave);
      } else {
        await addDoc(collection(db, "produtos"), dataToSave);
      }
      setIsEditing(false);
      resetForm();
      fetchProdutos();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o produto.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("ATENÇÃO: Deseja realmente excluir este equipamento? Esta ação não pode ser desfeita.")) {
      await deleteDoc(doc(db, "produtos", id));
      fetchProdutos();
    }
  };

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>, prod: any) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const url = await uploadToImgBB(e.target.files[0]);
        await updateDoc(doc(db, "produtos", prod.id), {
          imagem_url: url,
          imageUrl: url // retro-compatibility
        });
        fetchProdutos();
      } catch (err) {
        console.error(err);
        alert("Erro ao enviar a imagem. Tente novamente.");
        setLoading(false);
      }
    }
  };

  const handleEdit = (prod: any) => {
    setFormData({
      id: prod.id,
      nome: prod.nome || prod.title || "",
      title: prod.nome || prod.title || "",
      linha: prod.linha || "Macsport",
      categoria: prod.categoria || prod.subcategory || "",
      imagem_url: prod.imagem_url || prod.imageUrl || "",
      descricao: prod.descricao || prod.description || "",
      beneficios: Array.isArray(prod.beneficios) ? prod.beneficios.join('\n') : "",
      pdf_url: prod.pdf_url || "",
      como_usar_img: prod.como_usar_img || "",
      oculto: prod.oculto || false
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ id: "", nome: "", title: "", linha: "Macsport", categoria: "", imagem_url: "", descricao: "", beneficios: "", pdf_url: "", como_usar_img: "", oculto: false });
  };

  const filteredProdutos = produtos.filter((prod) => {
    const nomeMatch = (prod.nome || prod.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const prodLinha = (prod.linha || prod.category || "").toLowerCase();
    const prodCat = (prod.categoria || prod.subcategory || "").toLowerCase();
    
    // Some old products have Linha saved in Categoria and vice-versa
    const linhaMatch = filterLinha 
      ? prodLinha === filterLinha.toLowerCase() || prodCat === filterLinha.toLowerCase() 
      : true;
      
    const catMatch = filterCategoria 
      ? prodCat === filterCategoria.toLowerCase() || prodLinha === filterCategoria.toLowerCase() 
      : true;
      
    return nomeMatch && linhaMatch && catMatch;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProdutos.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleMassUpdate = async () => {
    if (selectedIds.length === 0) return;
    if (!massEditLinha && !massEditCategoria) {
      alert("Selecione Linha ou Categoria para alterar em massa.");
      return;
    }
    
    if (window.confirm(`Deseja alterar ${selectedIds.length} produtos?`)) {
      setLoading(true);
      try {
        const updates: any = {};
        if (massEditLinha) updates.linha = massEditLinha;
        if (massEditCategoria) updates.categoria = massEditCategoria;
        
        await Promise.all(selectedIds.map(id => updateDoc(doc(db, "produtos", id), updates)));
        
        alert("Produtos atualizados com sucesso!");
        setSelectedIds([]);
        setMassEditLinha("");
        setMassEditCategoria("");
        fetchProdutos();
      } catch (err) {
        console.error(err);
        alert("Erro na atualização em massa.");
        setLoading(false);
      }
    }
  };

  const handleMassDuplicate = async () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm(`Deseja DUPLICAR ${selectedIds.length} produtos?${massEditLinha || massEditCategoria ? ' (As seleções de Linha/Categoria atuais serão aplicadas nas cópias)' : ''}`)) {
      setLoading(true);
      try {
        const produtosToDuplicate = produtos.filter(p => selectedIds.includes(p.id));
        
        await Promise.all(produtosToDuplicate.map(async (produtoOriginal) => {
          const { id, ...dataToDuplicate } = produtoOriginal;
          
          dataToDuplicate.nome = `${dataToDuplicate.nome || dataToDuplicate.title} (Cópia)`;
          if (dataToDuplicate.title) dataToDuplicate.title = `${dataToDuplicate.title} (Cópia)`;
          if (dataToDuplicate.slug) dataToDuplicate.slug = `${dataToDuplicate.slug}-copia`;
          
          if (massEditLinha) dataToDuplicate.linha = massEditLinha;
          if (massEditCategoria) dataToDuplicate.categoria = massEditCategoria;
          
          await addDoc(collection(db, "produtos"), dataToDuplicate);
        }));
        
        alert("Produtos duplicados com sucesso!");
        setSelectedIds([]);
        setMassEditLinha("");
        setMassEditCategoria("");
        fetchProdutos();
      } catch (err) {
        console.error(err);
        alert("Erro na duplicação em massa.");
        setLoading(false);
      }
    }
  };

  const handleMassVisibility = async (ocultar: boolean) => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Deseja ${ocultar ? 'OCULTAR' : 'MOSTRAR'} ${selectedIds.length} produtos?`)) {
      setLoading(true);
      try {
        await Promise.all(selectedIds.map(id => updateDoc(doc(db, "produtos", id), { oculto: ocultar })));
        alert(`Produtos ${ocultar ? 'ocultados' : 'visíveis'} com sucesso!`);
        setSelectedIds([]);
        fetchProdutos();
      } catch (err) {
        console.error(err);
        alert("Erro ao alterar visibilidade em massa.");
        setLoading(false);
      }
    }
  };

  const handleMassDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`ATENÇÃO: Deseja EXCLUIR ${selectedIds.length} produtos? Essa ação não tem volta.`)) {
      setLoading(true);
      try {
        await Promise.all(selectedIds.map(id => deleteDoc(doc(db, "produtos", id))));
        alert("Produtos excluídos com sucesso!");
        setSelectedIds([]);
        fetchProdutos();
      } catch (err) {
        console.error(err);
        alert("Erro na exclusão em massa.");
        setLoading(false);
      }
    }
  };

  const processImportData = async (data: any[]) => {
    if (window.confirm(`Deseja importar ${data.length} produtos?`)) {
      setLoading(true);
      const errors: string[] = [];
      
      await Promise.all(data.map(async (item: any) => {
        try {
          const { id, ...cleanItem } = item;
          // Ignora linhas vazias do CSV
          if (!cleanItem.nome && !cleanItem.title) return;
          
          if (id) {
            try {
              await updateDoc(doc(db, "produtos", id), cleanItem);
            } catch (e) {
              await setDoc(doc(db, "produtos", id), cleanItem);
            }
          } else {
            await addDoc(collection(db, "produtos"), cleanItem);
          }
        } catch (err) {
          errors.push(item.nome || item.title || 'Produto Desconhecido');
        }
      }));

      if (errors.length > 0) {
        alert(`Importação concluída. Falha em ${errors.length} produtos.`);
      } else {
        alert("Importação em massa concluída com sucesso!");
      }
      fetchProdutos();
    }
  };

  const handleMassImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            console.error("Erros no CSV:", results.errors);
            alert("Houve alguns problemas ao ler o CSV. Verifique o console.");
          }
          await processImportData(results.data);
          e.target.value = '';
        },
        error: (error) => {
          alert("Erro ao ler arquivo CSV: " + error.message);
          e.target.value = '';
        }
      });
    } else if (file.name.toLowerCase().endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          let data = JSON.parse(text);
          if (!Array.isArray(data)) {
            alert("O arquivo JSON deve conter um array de objetos (produtos).");
            return;
          }
          await processImportData(data);
        } catch (err) {
          alert("Erro ao ler ou processar o arquivo JSON. Certifique-se de que é um JSON válido.");
          console.error(err);
        }
        e.target.value = '';
      };
      reader.readAsText(file);
    } else {
      alert("Formato de arquivo não suportado. Envie um arquivo .csv ou .json");
      e.target.value = '';
    }
  };

  const handleExportCSV = () => {
    if (produtos.length === 0) {
      alert("Nenhum produto para exportar.");
      return;
    }
    
    const exportData = produtos.map(p => ({
      id: p.id,
      nome: p.nome || p.title || "",
      linha: p.linha || "",
      categoria: p.categoria || p.subcategory || "",
      descricao: p.descricao || p.description || "",
      beneficios: Array.isArray(p.beneficios) ? p.beneficios.join(';') : (p.beneficios || ""),
      imagem_url: p.imagem_url || p.imageUrl || "",
      pdf_url: p.pdf_url || "",
      como_usar_img: p.como_usar_img || ""
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'produtos_macsport.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Equipamentos</h1>
        {!isEditing && (
          <div className="flex gap-4">
            <div className="relative flex items-center gap-2">
              <a 
                href="/modelo-importacao-macsport.csv" 
                download
                className="text-sm font-medium text-blue-600 hover:text-blue-800 underline mr-2"
                title="Baixar planilha de exemplo para preencher os produtos"
              >
                Baixar Modelo CSV
              </a>
              <input 
                type="file" 
                accept=".json,.csv" 
                onChange={handleMassImport}
                className="absolute right-0 top-0 w-32 h-full opacity-0 cursor-pointer"
                title="Importar CSV ou JSON"
              />
              <button 
                className="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <FileSpreadsheet size={20} /> Importar Planilha
              </button>
            </div>
            
            <button 
              onClick={handleExportCSV}
              className="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors"
              title="Baixar lista completa de produtos em CSV"
            >
              Baixar CSV
            </button>
            <button 
              onClick={() => { resetForm(); setIsEditing(true); }}
              className="bg-[#F5C400] text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-yellow-500 transition-colors"
            >
              <Plus size={20} /> Novo Equipamento
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow border border-gray-200 mb-8">
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-500 flex items-center gap-2 mb-6 hover:text-black transition-colors"
          >
            <ArrowLeft size={20} /> Voltar para a lista
          </button>
          
          <h2 className="text-2xl font-bold mb-6">{formData.id ? "Editar Equipamento" : "Cadastrar Novo Equipamento"}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Equipamento *</label>
                <input required type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400] focus:ring-1 focus:ring-[#F5C400]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem Principal *</label>
                <input required type="text" value={formData.imagem_url} onChange={(e) => setFormData({...formData, imagem_url: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400] focus:ring-1 focus:ring-[#F5C400]" placeholder="https://..." />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linha *</label>
                <select required value={formData.linha} onChange={(e) => setFormData({...formData, linha: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]">
                  <option value="">Selecione...</option>
                  {linhasDisponiveis.map(linha => (
                    <option key={linha} value={linha}>{linha}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria (Filtro) *</label>
                <select required value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]">
                  <option value="">Selecione...</option>
                  {categoriasDisponiveis.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" rows={3}></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Benefícios / Características (Um por linha)</label>
              <textarea value={formData.beneficios} onChange={(e) => setFormData({...formData, beneficios: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" rows={4} placeholder="Pintura eletrostática\nEstofado náutico..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do PDF (Catálogo/Manual)</label>
                <input type="text" value={formData.pdf_url} onChange={(e) => setFormData({...formData, pdf_url: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem 'Como Usar'</label>
                <input type="text" value={formData.como_usar_img} onChange={(e) => setFormData({...formData, como_usar_img: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-[#F5C400]" placeholder="https://..." />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <input 
                type="checkbox" 
                id="ocultoCheckbox" 
                checked={formData.oculto} 
                onChange={(e) => setFormData({...formData, oculto: e.target.checked})} 
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" 
              />
              <label htmlFor="ocultoCheckbox" className="text-sm font-medium text-gray-700 cursor-pointer">
                Ocultar produto no site (Salvar como Rascunho / Inativo)
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="submit" className="bg-[#F5C400] text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition-colors">
                Salvar Equipamento
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden mb-8">
          
          {/* Filters Area */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:border-[#F5C400]"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={filterLinha}
                onChange={(e) => setFilterLinha(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[#F5C400]"
              >
                <option value="">Todas as Linhas</option>
                {linhasDisponiveis.map(linha => (
                  <option key={linha} value={linha}>{linha}</option>
                ))}
              </select>
              <select 
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[#F5C400]"
              >
                <option value="">Todas as Categorias</option>
                {categoriasDisponiveis.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mass Edit Actions */}
          {selectedIds.length > 0 && (
            <div className="bg-[#F5C400]/20 border-b border-yellow-200 p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="font-bold text-gray-900">
                {selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Editar em massa:</span>
                <select 
                  value={massEditLinha}
                  onChange={(e) => setMassEditLinha(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
                >
                  <option value="">Alterar Linha...</option>
                  {linhasDisponiveis.map(linha => (
                    <option key={linha} value={linha}>{linha}</option>
                  ))}
                </select>
                <select 
                  value={massEditCategoria}
                  onChange={(e) => setMassEditCategoria(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
                >
                  <option value="">Alterar Categoria...</option>
                  {categoriasDisponiveis.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button 
                  onClick={handleMassUpdate}
                  className="bg-black text-[#F5C400] text-sm px-4 py-1.5 rounded-full font-bold hover:bg-gray-800 transition-colors"
                >
                  Aplicar
                </button>
                <div className="w-px h-6 bg-yellow-300 mx-2"></div>
                <button 
                  onClick={handleMassDuplicate}
                  className="flex items-center gap-1 text-blue-600 font-bold text-sm px-3 py-1.5 hover:bg-blue-100 rounded-full transition-colors"
                  title="Duplica os selecionados. Dica: selecione Linha/Categoria acima para as cópias já irem para a categoria certa."
                >
                  <Copy size={16} /> Duplicar
                </button>
                <div className="w-px h-6 bg-yellow-300 mx-2"></div>
                <button 
                  onClick={() => handleMassVisibility(false)}
                  className="bg-green-100 text-green-700 font-bold text-sm px-3 py-1.5 hover:bg-green-200 rounded-full transition-colors"
                >
                  Mostrar
                </button>
                <button 
                  onClick={() => handleMassVisibility(true)}
                  className="bg-gray-200 text-gray-700 font-bold text-sm px-3 py-1.5 hover:bg-gray-300 rounded-full transition-colors"
                >
                  Ocultar
                </button>
                <div className="w-px h-6 bg-yellow-300 mx-2"></div>
                <button 
                  onClick={handleMassDelete}
                  className="flex items-center gap-1 text-red-600 font-bold text-sm px-3 py-1.5 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando catálogo...</div>
          ) : filteredProdutos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum equipamento encontrado.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filteredProdutos.length && filteredProdutos.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                    />
                  </th>
                  <th className="px-6 py-4">Foto</th>
                  <th className="px-6 py-4">Equipamento</th>
                  <th className="px-6 py-4">Linha</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProdutos.map((prod) => (
                  <tr key={prod.id} className={`transition-colors ${selectedIds.includes(prod.id) ? 'bg-yellow-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(prod.id)}
                        onChange={() => handleSelectRow(prod.id)}
                        className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center p-1 relative group cursor-pointer overflow-hidden border border-dashed border-gray-300 hover:border-[#F5C400] transition-colors">
                        {(prod.imagem_url || prod.imageUrl) ? (
                          <img src={prod.imagem_url || prod.imageUrl} alt={prod.nome || prod.title} className="max-w-full max-h-full object-contain group-hover:opacity-40 transition-opacity" />
                        ) : (
                          <Upload size={20} className="text-gray-400 group-hover:opacity-40" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <span className="text-white text-[10px] font-bold px-1 text-center leading-tight">Trocar<br/>Foto</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          title="Clique para alterar a foto"
                          onChange={(e) => handleQuickUpload(e, prod)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        {prod.nome || prod.title}
                        {prod.oculto && (
                          <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Oculto</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {prod.linha}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{prod.categoria || prod.subcategory}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(prod)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

