import { db } from './firebase';
import { collection, getDocs, query } from 'firebase/firestore';

// Cache simples em memória para evitar chamadas repetidas ao Firestore
let cachedProducts: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 1 minuto

export async function getProducts() {
  const now = Date.now();
  
  // Retorna cache se válido
  if (cachedProducts && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const q = query(collection(db, 'produtos'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter((p: any) => p.oculto !== true);
    
    // Atualiza cache
    cachedProducts = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return cachedProducts || [];
  }
}

let cachedCategories: any[] | null = null;
let categoriesCacheTimestamp = 0;

export async function getCategories() {
  const now = Date.now();
  
  if (cachedCategories && (now - categoriesCacheTimestamp) < CACHE_DURATION) {
    return cachedCategories;
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'categorias'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    cachedCategories = data;
    categoriesCacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return cachedCategories || [];
  }
}

export function slugify(text: string) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function getProductBySlug(slug: string) {
  try {
    const products = await getProducts();
    return products.find((p: any) => slugify(p.title) === slug) || null;
  } catch (error) {
    console.error('Error finding product:', error);
    return null;
  }
}
