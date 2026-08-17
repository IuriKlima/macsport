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
  productSku?: string,
  productCategory?: string
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
      
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // 1. Top Yellow Bar
      doc.setFillColor(245, 196, 0); // #F5C400
      doc.rect(0, 0, pageWidth, 8, 'F');
      
      // 2. Logo
      try {
        const logoData = await getBase64ImageFromUrl("/Logo Macsport preto.png");
        if (logoData) {
          doc.addImage(logoData, 'PNG', 15, 15, 50, 12);
        }
      } catch (e) {
        console.warn("Could not load logo", e);
      }
      
      // 3. Product Image
      if (productImage) {
        try {
          const imgData = await getBase64ImageFromUrl(productImage);
          if (imgData) {
            doc.addImage(imgData, 'JPEG', 15, 35, 85, 85);
          }
        } catch (e) {
          console.warn("Could not load product image", e);
        }
      }
      
      // 4. Grey Info Box
      doc.setFillColor(249, 249, 249); // Light grey (#F9F9F9)
      doc.rect(105, 35, 90, 85, 'F');
      
      // Inside Info Box
      let currentY = 45;
      
      // Category
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(245, 196, 0); // Yellow
      doc.text((productCategory || "MACSPORT").toUpperCase(), 113, currentY);
      currentY += 7;
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(17, 17, 17); // #111
      const splitTitle = doc.splitTextToSize(productName, 74);
      doc.text(splitTitle, 113, currentY);
      currentY += splitTitle.length * 6 + 4;
      
      // Description Lines
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(85, 85, 85); // #555
      const shortDesc = descriptionLines.slice(0, 3).join(". ");
      if (shortDesc) {
        const splitShortDesc = doc.splitTextToSize(shortDesc + ".", 74);
        doc.text(splitShortDesc, 113, currentY);
        currentY += splitShortDesc.length * 4 + 4;
      }
      
      // Checkmarks
      const drawCheckItem = (text: string) => {
        doc.setDrawColor(245, 196, 0);
        doc.setLineWidth(0.5);
        // Draw simple checkmark
        doc.lines([[1.5, 1.5], [3, -3]], 113, currentY - 1);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(85, 85, 85);
        doc.text(text, 119, currentY);
        currentY += 5;
      };
      
      if (productSku && productSku !== 'N/A') {
        drawCheckItem(`SKU: ${productSku}`);
      }
      drawCheckItem("Alta Performance e Durabilidade");
      
      // 5. Specs Section (Left)
      let specsY = 135;
      
      // Sobre o Equipamento title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(17, 17, 17);
      doc.text("Sobre o Equipamento", 15, specsY);
      specsY += 8;
      
      // Specs List
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(85, 85, 85);
      
      for (let i = 0; i < descriptionLines.length; i++) {
        if (specsY > 280) {
          doc.addPage();
          specsY = 20;
        }
        const line = descriptionLines[i] + ".";
        const splitLine = doc.splitTextToSize(line, 95);
        doc.text(splitLine, 15, specsY);
        specsY += splitLine.length * 4 + 2;
      }
      
      // 6. QR Code & Button (Right)
      const qrY = 145;
      const qrX = 125;
      const qrSize = 50;
      
      try {
        const productUrl = window.location.href;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(productUrl)}&margin=1`;
        const qrData = await getBase64ImageFromUrl(qrApiUrl);
        if (qrData) {
          doc.addImage(qrData, 'PNG', qrX, qrY, qrSize, qrSize);
        }
      } catch (e) {
        console.warn("Could not load QR code", e);
      }
      
      // Button "Ver o Equipamento"
      const btnY = qrY + qrSize + 10;
      doc.setFillColor(245, 196, 0); // Yellow
      doc.roundedRect(qrX - 5, btnY, qrSize + 10, 10, 3, 3, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(17, 17, 17);
      const textWidth = doc.getTextWidth("Ver o Equipamento");
      doc.textWithLink("Ver o Equipamento", qrX - 5 + ((qrSize + 10) - textWidth) / 2, btnY + 6.5, { url: window.location.href });
      
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
