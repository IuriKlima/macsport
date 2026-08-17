const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente manualmente se não estiver usando o Next.js
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error("ERRO: FIREBASE_PRIVATE_KEY não encontrado no .env.local");
  process.exit(1);
}

// Inicializa o admin sdk
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const action = process.argv[2];
const targetUid = process.argv[3];

if (!action || !targetUid || (action !== '--grant' && action !== '--revoke')) {
  console.error("Uso: node scripts/set-admin.js --grant <USER_UID> ou node scripts/set-admin.js --revoke <USER_UID>");
  console.error("Você pode encontrar seu USER_UID no painel do Firebase Authentication.");
  process.exit(1);
}

async function manageAdmin() {
  try {
    if (action === '--grant') {
      console.log(`Concedendo privilégios de Admin ao usuário: ${targetUid}`);
      await admin.auth().setCustomUserClaims(targetUid, { admin: true });
      console.log("Sucesso! O usuário agora é um Administrador.");
    } else if (action === '--revoke') {
      console.log(`Removendo privilégios de Admin do usuário: ${targetUid}`);
      await admin.auth().setCustomUserClaims(targetUid, { admin: false });
      console.log("Sucesso! Os privilégios de Administrador foram removidos.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Erro ao definir custom claims:", error);
    process.exit(1);
  }
}

manageAdmin();
