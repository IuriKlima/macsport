import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function run() {
  const templatePath = path.join(process.cwd(), 'PDF de Instrução', 'PDF padrao.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Textos de teste
  const ptText = "ABDUTOR";
  const subText = "ABDUCTOR • ABDUCTOR";

  // Centralização PT
  const ptTextSize = 24; 
  const ptTextWidth = fontBold.widthOfTextAtSize(ptText, ptTextSize);
  const ptX = (450 - ptTextWidth) / 2;

  // Centralização Subtítulo
  const subTextSize = 10;
  const subTextWidth = fontBold.widthOfTextAtSize(subText, subTextSize);
  const subX = (450 - subTextWidth) / 2;

  // Escrever
  page.drawText(ptText, {
    x: ptX,
    y: 550, // SUBIU bastante (era 532)
    size: ptTextSize,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(subText, {
    x: subX,
    y: 533, // SUBIU bastante (era 515)
    size: subTextSize,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // QR Code
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
  const qrX = 48; // Voltou para a direita
  const qrY = 82; // Subiu o QR Code

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY, 
    width: qrSize,
    height: qrSize,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('teste-alinhamento-4.pdf', pdfBytes);
  console.log("Salvo em teste-alinhamento-4.pdf");
}

run().catch(console.error);
