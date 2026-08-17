import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { SiteHeader, SiteFooter } from "@/components/SiteLayoutManager";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/settings";
import Script from "next/script";
import { AOSProvider } from "@/components/AOSProvider";
import { CookieBanner } from "@/components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://macsport.com.br"),
  title: {
    default: "Macsport - Equipamentos Profissionais para Academias | Fabricação Nacional",
    template: "%s | Macsport",
  },
  description: "Equipamentos profissionais para academias com engenharia brasileira. Linhas Uranos, New Evo, Sigma, Evo e Cromus. Fabricação nacional, assistência técnica e projetos personalizados.",
  keywords: [
    "equipamentos para academia",
    "equipamentos fitness",
    "musculação",
    "fabricante de equipamentos",
    "academia equipamentos",
    "Macsport",
    "Linha Uranos",
    "New Evo",
    "equipamentos profissionais",
    "fabricação nacional",
    "equipamentos de musculação",
    "montar academia",
    "equipamentos brasileiros",
  ],
  authors: [{ name: "Macsport" }],
  creator: "Macsport",
  publisher: "Macsport",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://macsport.com.br",
    siteName: "Macsport",
    title: "Macsport - Equipamentos Profissionais para Academias",
    description: "Equipamentos profissionais para academias com engenharia brasileira. Fabricação nacional, assistência técnica e projetos sob medida.",
    images: [
      {
        url: "/Logo Macsport Amarela.png",
        width: 1200,
        height: 630,
        alt: "Macsport - Equipamentos Profissionais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Macsport - Equipamentos Profissionais para Academias",
    description: "Engenharia brasileira aplicada em equipamentos fitness de alta performance.",
    images: ["/Logo Macsport Amarela.png"],
  },
  alternates: {
    canonical: "https://macsport.com.br",
  },
  verification: {
    // Preencher quando tiver contas verificadas
    // google: "GOOGLE_VERIFICATION_CODE",
  },
  category: "Equipamentos Fitness",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Macsport",
  url: "https://macsport.com.br",
  logo: "https://macsport.com.br/Logo Macsport Amarela.png",
  description: "Fabricante brasileiro de equipamentos profissionais para academias. Linhas Uranos, New Evo, Sigma, Evo e Cromus.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
    addressRegion: "SP",
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: ["Portuguese", "English", "Spanish"],
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Macsport",
  url: "https://macsport.com.br",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://macsport.com.br/equipamentos?busca={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#F5C400" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://i.ibb.co" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        {/* Meta tag para otimização em Inteligências Artificiais (LLMs SEO) */}
        <link rel="alternate" type="text/markdown" title="Informações para LLMs (IA)" href="/llms.txt" />
        <style>{`
          .goog-te-banner-frame { display: none !important; }
          body { top: 0 !important; }
          .skiptranslate { display: none !important; }
          #google_translate_element { display: none !important; }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-200">
        <CookieBanner />
        <div id="google_translate_element"></div>
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'pt', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <Script 
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="lazyOnload" 
        />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "y3u0m80up8");
          `}
        </Script>
        <AccessibilityProvider>
          <LanguageProvider>
            <AOSProvider>
              <AnalyticsTracker />
            <SiteHeader />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <SiteFooter>
              <footer className="w-full bg-black border-t border-[#333] py-12 px-4 md:px-8 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Column 1: Logo & About */}
                  <div>
                    <Link href="/" className="mb-4 inline-block">
                      <Image src="/Logo Macsport Amarela.png" alt="Macsport" width={150} height={48} className="h-12 w-auto object-contain" />
                    </Link>
                    <p className="text-gray-300 mb-6 text-sm max-w-xs">
                      Macsport. Inovação que move resultados. Fabricação nacional de equipamentos fitness profissionais.
                    </p>
                  </div>

                  {/* Column 2: Navegação */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Navegação</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><Link href="/" className="hover:text-macsport transition-colors">Home</Link></li>
                      <li><Link href="/quem-somos" className="hover:text-macsport transition-colors">Conheça a Mac</Link></li>
                      <li><Link href="/equipamentos" className="hover:text-macsport transition-colors">Equipamentos</Link></li>
                      <li><Link href="/blog" className="hover:text-macsport transition-colors">Blog</Link></li>
                      <li><Link href="/trabalhe-conosco" className="hover:text-macsport transition-colors">Trabalhe Conosco</Link></li>
                    </ul>
                  </div>

                  {/* Column 3: Linhas */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Linhas</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><Link href="/equipamentos?linha=Macsport" className="hover:text-macsport transition-colors">Peso Livre</Link></li>
                      <li><Link href="/equipamentos?linha=Sigma" className="hover:text-macsport transition-colors">Sigma</Link></li>
                      <li><Link href="/equipamentos?linha=Uranos" className="hover:text-macsport transition-colors">Uranos</Link></li>
                      <li><Link href="/equipamentos?linha=Evo" className="hover:text-macsport transition-colors">Evo</Link></li>
                      <li><Link href="/equipamentos?linha=New Evo" className="hover:text-macsport transition-colors">New Evo</Link></li>
                      <li><Link href="/equipamentos?linha=Cromus" className="hover:text-macsport transition-colors">Cromus</Link></li>
                    </ul>
                  </div>

                  {/* Column 4: Contato & Localização */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Contato e Localização</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span>{settings.telefoneContato}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <span>{settings.emailContato}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>{settings.endereco}</span>
                      </li>
                      {settings.whatsapp && (
                        <li>
                          <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-macsport transition-colors flex items-center gap-2 text-green-400 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                            Fale pelo WhatsApp
                          </a>
                        </li>
                      )}
                    </ul>
                    
                    {(settings.linkInstagram || settings.linkFacebook || settings.linkYoutube || settings.linkLinkedin) && (
                      <div className="mt-6 flex items-center gap-4">
                        {settings.linkInstagram && (
                          <a href={settings.linkInstagram} target="_blank" rel="noreferrer" aria-label="Instagram da Macsport" className="text-gray-400 hover:text-macsport transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                          </a>
                        )}
                        {settings.linkFacebook && (
                          <a href={settings.linkFacebook} target="_blank" rel="noreferrer" aria-label="Facebook da Macsport" className="text-gray-400 hover:text-macsport transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                          </a>
                        )}
                        {settings.linkYoutube && (
                          <a href={settings.linkYoutube} target="_blank" rel="noreferrer" aria-label="YouTube da Macsport" className="text-gray-400 hover:text-macsport transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                          </a>
                        )}
                        {settings.linkLinkedin && (
                          <a href={settings.linkLinkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn da Macsport" className="text-gray-400 hover:text-macsport transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#333] flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                  <p>&copy; {new Date().getFullYear()} Macsport. Todos os direitos reservados.</p>
                  <div className="flex gap-4">
                    <Link href="/politica-de-privacidade" className="hover:text-macsport transition-colors">Política de Privacidade</Link>
                    <Link href="/termos-de-uso" className="hover:text-macsport transition-colors">Termos de Uso</Link>
                  </div>
                </div>
              </footer>
              <WhatsAppButton phoneNumber={settings.whatsapp} />
            </SiteFooter>
            </AOSProvider>
          </LanguageProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
