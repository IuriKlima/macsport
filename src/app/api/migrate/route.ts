import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const SUPABASE_URL = 'https://cqnvzlcrdhqjqjwkuick.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbnZ6bGNyZGhxanFqd2t1aWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTQxODgsImV4cCI6MjA4ODMzMDE4OH0.nZKTWFmoQyCw3PEDZOWXu2IU4nraV8BpIhu-ZEIWBok';

export async function GET() {
  try {
    // 1. Fetch from Supabase (tabela rss_products sem filtro na query string)
    const resProdutos = await fetch(`${SUPABASE_URL}/rest/v1/rss_products?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!resProdutos.ok) {
      throw new Error(`Supabase error: ${resProdutos.statusText}`);
    }
    
    const todosProdutos = await resProdutos.json();
    
    // Filtro pelas linhas solicitadas (macsport, sigma, uranos, evo, cromus)
    const allowedLines = ['macsport', 'sigma', 'uranos', 'evo', 'cromus'];
    const produtos = todosProdutos.filter((p: any) => {
      const cat = (p.category || '').toLowerCase();
      const subcat = (p.subcategory || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      
      // Checa se alguma das palavras-chave aparece na categoria, subcategoria ou título
      return allowedLines.some(line => cat.includes(line) || subcat.includes(line) || title.includes(line));
    });

    console.log(`Found ${todosProdutos.length} total, filtered down to ${produtos.length} produtos.`);

    // 2. Write to Firebase
    let count = 0;
    for (const p of produtos) {
      // Forçar a linha Macsport para aparecerem no nosso catálogo
      p.linha = 'Macsport';
      
      // Use the id from supabase as the document ID in Firebase
      await setDoc(doc(collection(db, 'produtos'), String(p.id)), p);
      count++;
    }

    return NextResponse.json({ success: true, migrated: count, sample: produtos[0] });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
