import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

async function run() {
  const templatePath = path.join(process.cwd(), 'PDF de Instrução', 'PDF Padrão.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  // NÃO VAMOS MAIS ESCREVER O TÍTULO (NOME) NO TOPO!

  // Gerar QR Code
  const url = "https://macsport.com.br/produto/linha/produto";
  const qrDataUri = await QRCode.toDataURL(url, { 
    width: 200, 
    margin: 0, 
    color: { dark: '#000000', light: '#ffffff' }
  });
  
  const qrImageBytes = Buffer.from(qrDataUri.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  // Posição QR Code
  const qrSize = 88;
  const qrX = 48; // Posição X
  const qrY = 72; // Posição Y

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY, 
    width: qrSize,
    height: qrSize,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('teste-somente-qr.pdf', pdfBytes);
  console.log("Salvo em teste-somente-qr.pdf");
}

run().catch(console.error);
