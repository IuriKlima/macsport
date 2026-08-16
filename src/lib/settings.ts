import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const defaultSettings = {
  emailContato: "contato@macsport.com.br",
  telefoneContato: "11975297371",
  endereco: "Av. Sen. Teotônio Vilela, 8500 - Jardim Casa Grande, São Paulo - SP, 04868-002",
  linkInstagram: "https://www.instagram.com/macsportoficial",
  linkFacebook: "https://www.facebook.com/macsportoficial/?locale=pt_BR",
  linkYoutube: "https://www.youtube.com/@macsportoficial",
  linkLinkedin: "https://www.linkedin.com/company/macsport-ltd/posts/?feedView=all",
  whatsapp: "5511975297371",
};

// Cache de configurações (5 minutos)
let cachedSettings: typeof defaultSettings | null = null;
let settingsCacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function getSettings() {
  const now = Date.now();
  
  if (cachedSettings && (now - settingsCacheTimestamp) < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const docRef = doc(db, "configuracoes", "geral");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const merged = { ...defaultSettings, ...docSnap.data() };
      cachedSettings = merged;
      settingsCacheTimestamp = now;
      return merged;
    }
  } catch (err) {
    console.error("Erro ao buscar configurações:", err);
    if (cachedSettings) return cachedSettings;
  }

  return defaultSettings;
}
