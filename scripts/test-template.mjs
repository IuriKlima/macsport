import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';
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

async function testTemplate() {
  const url = 'https://macsport.com.br/produto/linha/produto-teste';
  const nome = 'EQUIPAMENTO DE TESTE MACSPORT';

  // Ler Template
  const templatePath = path.join(process.cwd(), 'PDF de Instrução', 'PDF Padrão.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  // 1. Gerar o QR Code
  const qrDataUri = await QRCode.toDataURL(url, { 
    width: 300, 
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  const qrImageBytes = Buffer.from(qrDataUri.split(',')[1], 'base64');

  // 2. Carregar o documento PDF Template
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const page = pages[0]; // Primeira página

  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  // 3. Desenhar elementos
  // Posições chutadas: QR Code no centro, Nome um pouco acima
  // Largura da página: 450, Altura: 675
  
  const qrSize = 250;
  const qrX = (450 - qrSize) / 2; // Centralizado = 100
  const qrY = 150; // Mais para baixo (o zero do Y é no pé da página)

  // Nome do Produto
  page.drawText(nome, {
    x: 50,
    y: qrY + qrSize + 40, // 40 pts acima do QR code
    size: 20,
    color: rgb(0, 0, 0),
  });

  // Desenhar a imagem do QR code
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY, 
    width: qrSize,
    height: qrSize,
  });

  // 4. Salvar o PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('teste-template.pdf', pdfBytes);
  console.log("Arquivo 'teste-template.pdf' gerado na raiz com sucesso!");
}

testTemplate().catch(console.error);
