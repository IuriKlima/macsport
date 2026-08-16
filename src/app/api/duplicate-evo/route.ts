import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export async function GET() {
  try {
    const q = query(collection(db, 'produtos'));
    const querySnapshot = await getDocs(q);
    
    const uniqueLines = new Set();
    const allProducts = [];

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const linha = data.linha || data.category || data.categoria || 'undefined';
      uniqueLines.add(linha);
      allProducts.push({ name: data.nome, line: linha });
    }

    return NextResponse.json({ lines: Array.from(uniqueLines), allProducts });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
