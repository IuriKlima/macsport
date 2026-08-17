"use client";

import { useState, useEffect } from "react";
import { Share2, X, Link as LinkIcon, Download, Check } from "lucide-react";

export function ShareButton({ productName }: { productName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");

  useEffect(() => {
    setProductUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(`Confira este equipamento: ${productName}`);

  useEffect(() => {
    if (isOpen && productUrl) {
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}&margin=1`);
    }
  }, [isOpen, encodedUrl, productUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_${productName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto font-bold py-4 px-6 rounded-full text-lg transition-colors flex items-center justify-center gap-2 bg-transparent text-text-muted border border-border hover:border-[#F5C400] hover:text-[#F5C400]"
        aria-label="Compartilhar produto"
      >
        <Share2 size={22} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card-bg border border-border rounded-3xl p-6 md:p-8 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-foreground transition-colors p-2 bg-black/5 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Share2 className="text-[#F5C400]" /> Compartilhar
            </h3>

            {/* Social Links */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <a href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <span className="text-xs font-bold text-text-muted group-hover:text-foreground">WhatsApp</span>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </div>
                <span className="text-xs font-bold text-text-muted group-hover:text-foreground">Facebook</span>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-black/5 text-foreground flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors border border-border">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                </div>
                <span className="text-xs font-bold text-text-muted group-hover:text-foreground">X</span>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center group-hover:bg-[#0A66C2] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
                <span className="text-xs font-bold text-text-muted group-hover:text-foreground">LinkedIn</span>
              </a>
            </div>

            <div className="flex items-center gap-2 bg-black/5 p-2 rounded-xl mb-8 border border-border">
              <input type="text" readOnly value={productUrl} className="bg-transparent flex-1 outline-none px-2 text-sm text-text-muted truncate" />
              <button 
                onClick={copyToClipboard}
                className="bg-[#F5C400] text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-yellow-500 transition-colors"
              >
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>

            {/* QR Code */}
            <div className="border-t border-border pt-6 flex flex-col items-center">
              <h4 className="text-sm font-bold text-text-muted mb-4 uppercase tracking-wider">Escaneie o QR Code</h4>
              {qrCodeUrl ? (
                <div className="bg-white p-2 rounded-xl mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                </div>
              ) : (
                <div className="w-32 h-32 bg-black/5 rounded-xl mb-4 animate-pulse"></div>
              )}
              <button 
                onClick={downloadQR}
                className="text-[#F5C400] font-bold text-sm flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <Download size={16} /> Baixar QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
