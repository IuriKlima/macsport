import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/settings";

export async function WhatsAppBanner() {
  const settings = await getSettings();
  const whatsappNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : "5511975297371";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="w-full relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full overflow-hidden rounded-[2rem] hover:scale-[1.02] transition-transform duration-300"
        >
          {/* Imagem Mobile */}
          <Image 
            src="/macsport-maia-whatsapp-mobile-1080x1920.png" 
            alt="Fale com a Maia no WhatsApp" 
            width={1080}
            height={1920}
            className="w-full h-auto object-cover block md:hidden"
          />
          
          {/* Imagem Desktop */}
          <Image 
            src="/macsport-maia-whatsapp-web-1920x640.png" 
            alt="Fale com a Maia no WhatsApp" 
            width={1920}
            height={640}
            className="w-full h-auto object-cover hidden md:block"
          />
        </a>
      </div>
    </div>
  );
}
