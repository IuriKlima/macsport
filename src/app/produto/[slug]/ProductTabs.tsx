"use client";

import { useState } from "react";
import { FileText, Download, ShieldCheck, Award, Loader2 } from "lucide-react";

export function ProductTabs({ 
  descriptionLines, 
  productName, 
  pdfUrl, 
  comoUsarImg,
  productImage,
  productSku
}: { 
  descriptionLines: string[], 
  productName: string, 
  pdfUrl?: string, 
  comoUsarImg?: string,
  productImage?: string,
  productSku?: string
}) {
  const [activeTab, setActiveTab] = useState("descricao");
  const [isGenerating, setIsGenerating] = useState(false);

  function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No context");
        
        // Fill with white background in case of transparent PNG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg", 0.9);
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = imageUrl;
    });
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const margin = 20;
      let yPos = 20;
      const pageWidth = doc.internal.pageSize.getWidth();

      // 1. Add Header (Dark Gray background)
      doc.setFillColor(17, 17, 17); // #111
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      try {
        const logoData = await getBase64ImageFromUrl("/Logo Macsport Amarela.png");
        if (logoData) {
          // Adjust logo width/height to keep aspect ratio
          doc.addImage(logoData, 'JPEG', margin, 10, 40, 15);
        }
      } catch (e) {
        console.warn("Could not load logo", e);
      }

      yPos = 60;

      // 2. Add Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      const splitTitle = doc.splitTextToSize(productName, pageWidth - 2 * margin);
      doc.text(splitTitle, margin, yPos);
      yPos += splitTitle.length * 10;

      // 3. Add SKU / Code
      if (productSku && productSku !== 'N/A') {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`CÓDIGO: ${productSku}`, margin, yPos);
        yPos += 15;
      }

      // 4. Add Product Image
      if (productImage) {
        try {
          const imgData = await getBase64ImageFromUrl(productImage);
          const imgWidth = 120;
          const imgHeight = 120;
          const xPos = (pageWidth - imgWidth) / 2;
          
          if (imgData) {
            doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
          }
          yPos += imgHeight + 20;
        } catch (e) {
          console.warn("Could not load product image", e);
          yPos += 10;
        }
      }

      // Check for page break before description
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      // 5. Add Description
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 30, 30);
      doc.text("Especificações Técnicas", margin, yPos);
      yPos += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      const descriptionText = descriptionLines.join(". ");
      const splitDesc = doc.splitTextToSize(descriptionText, pageWidth - 2 * margin);
      
      for (let i = 0; i < splitDesc.length; i++) {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(splitDesc[i], margin, yPos);
        yPos += 7;
      }

      // Save
      doc.save(`Macsport_${productName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-16">
      <div className="flex border-b border-border mb-8 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab("descricao")}
          className={`px-6 py-4 whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'descricao' ? 'text-[#F5C400] border-b-2 border-[#F5C400] font-bold' : 'text-text-muted hover:text-foreground font-semibold'}`}
        >
          <FileText size={18} />
          DESCRIÇÃO COMPLETA
        </button>
        <button 
          onClick={() => setActiveTab("pdf")}
          className={`px-6 py-4 whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'pdf' ? 'text-[#F5C400] border-b-2 border-[#F5C400] font-bold' : 'text-text-muted hover:text-foreground font-semibold'}`}
        >
          <Download size={18} />
          BAIXAR PDF DO PRODUTO
        </button>
        <button 
          onClick={() => setActiveTab("garantia")}
          className={`px-6 py-4 whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'garantia' ? 'text-[#F5C400] border-b-2 border-[#F5C400] font-bold' : 'text-text-muted hover:text-foreground font-semibold'}`}
        >
          <ShieldCheck size={18} />
          GARANTIA
        </button>
        {comoUsarImg && (
          <button 
            onClick={() => setActiveTab("comousar")}
            className={`px-6 py-4 whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'comousar' ? 'text-[#F5C400] border-b-2 border-[#F5C400] font-bold' : 'text-text-muted hover:text-foreground font-semibold'}`}
          >
            <Award size={18} />
            COMO USAR
          </button>
        )}
      </div>

      <div className="bg-card-bg rounded-[2rem] p-8 border border-border min-h-[300px]">
        {activeTab === "descricao" && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Sobre o Equipamento</h3>
            <div className="prose prose-invert max-w-none text-text-muted">
              {descriptionLines.length > 0 ? descriptionLines.map((line: string, i: number) => (
                <p key={i} className="mb-4 leading-relaxed">{line}.</p>
              )) : (
                <p>Nenhuma descrição adicional disponível.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "pdf" && (
          <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-10 text-center">
            <div className="w-20 h-20 bg-[#F5C400]/10 text-[#F5C400] rounded-full flex items-center justify-center mb-6">
              <Download size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Catálogo e Especificações Técnicas</h3>
            <p className="text-text-muted mb-8 max-w-lg">
              Faça o download do PDF completo com a imagem, título, código e as especificações técnicas do {productName}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button 
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="bg-[#F5C400] text-black font-bold px-8 py-3 rounded-[2rem] flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-70"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                {isGenerating ? "GERANDO ARQUIVO..." : "GERAR PDF DO PRODUTO"}
              </button>

              {pdfUrl && (
                <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-transparent border border-[#F5C400] text-[#F5C400] hover:bg-[#F5C400]/10 font-bold px-8 py-3 rounded-[2rem] flex items-center gap-2 transition-colors"
                >
                  <FileText size={20} />
                  BAIXAR MANUAL ORIGINAL
                </a>
              )}
            </div>
          </div>
        )}

        {activeTab === "garantia" && (
          <div className="animate-in fade-in duration-500">
            {/* Certificado de Garantia visual */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-[#F5C400]/30 rounded-[2rem] p-8 md:p-12 shadow-2xl">
              {/* Marca d'água */}
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                <Award size={300} />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-[#F5C400] to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-4 border-black">
                  <div className="text-center text-black">
                    <span className="block text-4xl font-black leading-none">5</span>
                    <span className="block text-xs font-bold uppercase tracking-widest">Anos</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl font-light text-white mb-2 flex items-center gap-3">
                    <Award className="text-[#F5C400]" size={32} />
                    Certificado de Garantia
                  </h3>
                  <div className="h-1 w-20 bg-[#F5C400] mb-6"></div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                    A Macsport atesta a qualidade excepcional de seus produtos. O equipamento <strong className="text-white">{productName}</strong> possui cobertura total contra defeitos de fabricação em sua estrutura.
                  </p>
                  
                  <ul className="text-gray-400 space-y-2 font-medium">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#F5C400] rounded-full"></div> <strong>5 anos</strong> para estrutura principal (chassi).</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#F5C400] rounded-full"></div> <strong>1 ano</strong> para pintura e soldas.</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#F5C400] rounded-full"></div> <strong>6 meses</strong> para estofados, cabos, polias e rolamentos.</li>
                  </ul>
                  
                  <p className="text-xs text-gray-500 mt-6">
                    Para acionar a garantia, entre em contato com nosso suporte técnico informando o número de série do seu equipamento e a nota fiscal de compra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comousar" && comoUsarImg && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Como Usar</h3>
            <div className="w-full rounded-[2rem] overflow-hidden border border-border">
              <img src={comoUsarImg} alt={`Como usar o ${productName}`} className="w-full h-auto object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
