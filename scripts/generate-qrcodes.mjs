import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

function getTranslations(ptName) {
  let base = ptName.replace(/\s*\(.*\)\s*/g, '').replace(/\s*c\/.*$/i, '').trim();
  
  // Custom exact matches or fallback
  const dict = {
    'Adutor / Abdutor Conjugado': {en: 'ADDUCTOR & ABDUCTOR', es: 'ADUCTOR Y ABDUCTOR'},
    'Ext. / Flex. DEITADA Conjugada': {en: 'DUAL LYING LEG EXTENSION & CURL', es: 'EXTENSIÓN Y CURL DE PIERNAS TUMBADO DUAL'},
    'Ext. / Flex. Sentada Conjugada': {en: 'DUAL SEATED LEG EXTENSION & CURL', es: 'EXTENSIÓN Y CURL DE PIERNAS SENTADO DUAL'},
    'Ext. / Flex. Sent. Conj.': {en: 'DUAL SEATED LEG EXTENSION & CURL', es: 'EXTENSIÓN Y CURL DE PIERNAS SENTADO DUAL'},
  };

  if (dict[base]) return { pt: base.toUpperCase(), en: dict[base].en, es: dict[base].es };

  let en = base;
  let es = base;

  const rules = [
    [/Glúteo/gi, 'Glute', 'Glúteo'],
    [/Banco Supino Declinado Articulado/gi, 'Articulated Decline Bench Press', 'Press de Banca Declinado Articulado'],
    [/Banco Supino Inclinado Articulado/gi, 'Articulated Incline Bench Press', 'Press de Banca Inclinado Articulado'],
    [/Banco Supino Reto Articulado/gi, 'Articulated Flat Bench Press', 'Press de Banca Plano Articulado'],
    [/Banco Supino Reto/gi, 'Flat Bench Press', 'Press de Banca Plano'],
    [/Banco Supino Inclinado/gi, 'Incline Bench Press', 'Press de Banca Inclinado'],
    [/Banco Supino Declinado/gi, 'Decline Bench Press', 'Press de Banca Declinado'],
    [/Banco Supino/gi, 'Bench Press', 'Press de Banca'],
    [/Supino Multi Funcional/gi, 'Multi Functional Bench Press', 'Prensa Multifuncional'],
    [/Supino Vertical/gi, 'Vertical Bench Press', 'Press de Banca Vertical'],
    [/Supino/gi, 'Bench Press', 'Press de Banca'],
    [/Flexora Deitada/gi, 'Lying Leg Curl', 'Curl de Piernas Tumbado'],
    [/Flexora Vertical/gi, 'Vertical Leg Curl', 'Curl de Piernas Vertical'],
    [/Flexora Sentado/gi, 'Seated Leg Curl', 'Curl de Piernas Sentado'],
    [/Flexora/gi, 'Leg Curl', 'Curl de Piernas'],
    [/Extensora/gi, 'Leg Extension', 'Extensión de Piernas'],
    [/Adutor/gi, 'Adductor', 'Aductor'],
    [/Abdutor/gi, 'Abductor', 'Abductor'],
    [/Leg Press Horizontal/gi, 'Horizontal Leg Press', 'Prensa de Piernas Horizontal'],
    [/Leg Press 45 Graus/gi, '45 Degree Leg Press', 'Prensa de Piernas 45 Grados'],
    [/Leg Press Regulável/gi, 'Adjustable Leg Press', 'Prensa de Piernas Ajustable'],
    [/Leg Press Unilateral/gi, 'Unilateral Leg Press', 'Prensa de Piernas Unilateral'],
    [/Leg Press/gi, 'Leg Press', 'Prensa de Piernas'],
    [/Crossover Angular/gi, 'Angular Crossover', 'Crossover Angular'],
    [/Crossover/gi, 'Crossover', 'Crossover'],
    [/Cross\. Ang\./gi, 'Angular Crossover', 'Crossover Angular'],
    [/Polia Alta Articulada/gi, 'Articulated High Pulley', 'Polea Alta Articulada'],
    [/Polia Alta/gi, 'High Pulley', 'Polea Alta'],
    [/Polia Baixa/gi, 'Low Pulley', 'Polea Baja'],
    [/Polia Regulavel Simples/gi, 'Simple Adjustable Pulley', 'Polea Ajustable Simple'],
    [/Polia/gi, 'Pulley', 'Polea'],
    [/Pulley/gi, 'Pulley', 'Polea'],
    [/Remada Sentada Máquina/gi, 'Seated Row Machine', 'Máquina de Remo Sentado'],
    [/Remada Sentada Articulada/gi, 'Articulated Seated Row', 'Remo Sentado Articulado'],
    [/Remada Articulada/gi, 'Articulated Row', 'Remo Articulado'],
    [/Remada Cavalinho/gi, 'T-Bar Row', 'Remo en T'],
    [/Remada/gi, 'Row', 'Remo'],
    [/Desenv\. Ombro Máquina/gi, 'Shoulder Press Machine', 'Máquina de Press de Hombros'],
    [/Desenv\. Ombro Articulado/gi, 'Articulated Shoulder Press', 'Press de Hombros Articulado'],
    [/Elevação de Ombro/gi, 'Shoulder Elevation', 'Elevación de Hombros'],
    [/Elevação Pélvica/gi, 'Pelvic Thrust', 'Empuje Pélvico'],
    [/Elev\. Pélvica Articulada com Cinta/gi, 'Articulated Pelvic Thrust with Belt', 'Empuje Pélvico Articulado con Cinturón'],
    [/Panturrilha Articulada/gi, 'Articulated Calf', 'Pantorrilla Articulada'],
    [/Panturrilha Vert\./gi, 'Vertical Calf', 'Pantorrilla Vertical'],
    [/Panturrilha Sentada/gi, 'Seated Calf', 'Pantorrilla Sentada'],
    [/Tríceps Máquina/gi, 'Triceps Machine', 'Máquina de Tríceps'],
    [/Bíceps Máquina/gi, 'Biceps Machine', 'Máquina de Bíceps'],
    [/Deltoide Máquina/gi, 'Deltoid Machine', 'Máquina de Deltoides'],
    [/Abdominal Máquina/gi, 'Abdominal Machine', 'Máquina Abdominal'],
    [/Abdominal/gi, 'Abdominal', 'Abdominal'],
    [/Gráviton/gi, 'Assisted Pull-up', 'Dominadas Asistidas'],
    [/Fly/gi, 'Fly', 'Peck Deck'],
    [/Peck Deck/gi, 'Peck Deck', 'Peck Deck'],
    [/Barra Guiada/gi, 'Smith Machine', 'Máquina Smith'],
    [/Smith de Parede/gi, 'Wall Smith Machine', 'Máquina Smith de Pared'],
    [/Hack Burrinho/gi, 'Donkey Calf', 'Elevación de Talones Tipo Burro'],
    [/Hack 45/gi, 'Hack 45', 'Hack 45'],
    [/Hack/gi, 'Hack Squat', 'Sentadilla Hack'],
    [/Apolete/gi, 'Multi Hip', 'Multi Cadera'],
    [/Banco/gi, 'Bench', 'Banco'],
    [/Suporte/gi, 'Rack', 'Soporte'],
    [/Agachamento/gi, 'Squat', 'Sentadilla'],
    [/Estação/gi, 'Station', 'Estación'],
    [/Máquina/gi, 'Machine', 'Máquina'],
    [/Articulada/gi, 'Articulated', 'Articulada'],
    [/Articulado/gi, 'Articulated', 'Articulado'],
    [/Conjugada/gi, 'Dual', 'Dual'],
    [/Conjugado/gi, 'Dual', 'Dual'],
    [/Livre/gi, 'Free', 'Libre'],
    [/Deitada/gi, 'Lying', 'Tumbado'],
    [/Deitado/gi, 'Lying', 'Tumbado'],
    [/Sentada/gi, 'Seated', 'Sentada'],
    [/Sentado/gi, 'Seated', 'Sentado']
  ];

  rules.forEach(r => {
    en = en.replace(r[0], r[1]);
    es = es.replace(r[0], r[2]);
  });

  return { pt: base.toUpperCase(), en: en.toUpperCase(), es: es.toUpperCase() };
}

async function generateQRCodes() {
  console.log("Conectando ao Firebase para buscar os produtos...");
  const snapshot = await getDocs(collection(db, 'produtos'));
  
  const outputDir = path.join(process.cwd(), 'qrcodes_pdf');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }


  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.oculto === true || String(data.oculto).toLowerCase() === 'true') {
      continue;
    }

    const linha = data.linha || 'macsport';
    const nome = data.nome || data.title;

    if (!nome) continue;

    const linhaSlug = slugify(linha);
    // Filtrar SOMENTE a linha Uranos
    if (linhaSlug !== 'uranos') {
      continue;
    }
    const produtoSlug = slugify(nome);
    const url = `https://macsport.com.br/produto/${linhaSlug}/${produtoSlug}`;
    
    try {
      const trans = getTranslations(nome);
      
      // Gerar QR Code SEM MARGEM para caber exatamente no quadrado
      const qrDataUri = await QRCode.toDataURL(url, { 
        width: 200, 
        margin: 0,
        color: { dark: '#000000', light: '#ffffff' }
      });
      const qrImageBytes = Buffer.from(qrDataUri.split(',')[1], 'base64');

      const templatePath = path.join(process.cwd(), 'PDF de Instrução', 'PDF padrao.pdf');
      const templateBytes = fs.readFileSync(templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const page = pages[0];
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      // Título em PT (maior)
      const ptText = trans.pt.length > 55 ? trans.pt.substring(0, 52) + '...' : trans.pt;
      const ptTextSize = ptText.length > 30 ? 18 : 24;
      const ptTextWidth = fontBold.widthOfTextAtSize(ptText, ptTextSize);
      const ptX = (450 - ptTextWidth) / 2;
      
      page.drawText(ptText, {
        x: ptX,
        y: 550, // SUBIU bastante
        size: ptTextSize,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Subtitulo em EN e ES (menor)
      const subText = `${trans.en} • ${trans.es}`;
      const subTextSize = subText.length > 60 ? 9 : 10;
      const subTextWidth = fontBold.widthOfTextAtSize(subText, subTextSize);
      const subX = (450 - subTextWidth) / 2;

      page.drawText(subText, {
        x: subX,
        y: 533, // SUBIU bastante
        size: subTextSize,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Posição para o QR Code
      const qrSize = 88;
      page.drawImage(qrImage, {
        x: 48,   // Voltou pra direita
        y: 82,   // Subiu 10 pontos
        width: qrSize,
        height: qrSize,
      });

      // Salvar
      const pdfBytes = await pdfDoc.save();
      const safeFilename = `${linhaSlug}-${produtoSlug}.pdf`;
      const filepath = path.join(outputDir, safeFilename);
      
      fs.writeFileSync(filepath, pdfBytes);
      console.log(`Gerado PDF: ${safeFilename}`);
      count++;
    } catch (err) {
      console.error(`Erro ao gerar QR Code para ${nome}:`, err);
    }
  }

  console.log(`\n======================================`);
  console.log(`Concluído! ${count} arquivos PDF gerados em:`);
  console.log(`${outputDir}`);
  console.log(`======================================`);
}

generateQRCodes().catch(console.error);
