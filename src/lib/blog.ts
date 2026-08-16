import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { slugify } from './products';

const DEFAULT_POSTS = [
  {
    id: 1,
    titulo: 'Como escolher equipamentos para montar uma academia',
    resumo: 'Descubra os principais fatores estruturais, biomecânicos e financeiros para tomar a melhor decisão na hora de equipar seu novo espaço fitness.',
    data: '12 Ago 2026',
    autor: 'Equipe Macsport',
    categoria: 'Como montar uma academia',
    imagem: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 2,
    titulo: 'Musculação, cardio e peso livre: como distribuir o espaço',
    resumo: 'Aprenda a criar um fluxo de treino eficiente e seguro na sua academia, otimizando o m² e melhorando a experiência dos seus alunos.',
    data: '05 Ago 2026',
    autor: 'Equipe Macsport',
    categoria: 'Gestão e operação',
    imagem: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 3,
    titulo: 'Diferenças entre as linhas Macsport',
    resumo: 'Uranos, Sigma, Evo, New Evo ou Peso Livre? Entenda qual linha de equipamentos é a mais indicada para o perfil do seu projeto comercial.',
    data: '28 Jul 2026',
    autor: 'Macsport News',
    categoria: 'Equipamentos e biomecânica',
    imagem: '/Banner Uranos.png',
  },
];

// Cache para posts
let cachedPosts: any[] | null = null;
let postsCacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 1 minuto

export async function getPosts() {
  const now = Date.now();
  
  if (cachedPosts && (now - postsCacheTimestamp) < CACHE_DURATION) {
    return cachedPosts;
  }

  try {
    const snap = await getDocs(collection(db, 'blog'));
    if (!snap.empty) {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      cachedPosts = sorted;
      postsCacheTimestamp = now;
      return sorted;
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
    if (cachedPosts) return cachedPosts;
  }
  return DEFAULT_POSTS;
}

export async function getPostById(idOrSlug: string) {
  const posts = await getPosts();
  return posts.find((p: any) => 
    p.id.toString() === idOrSlug || 
    p.slug === idOrSlug || 
    slugify(p.titulo) === idOrSlug
  ) || null;
}
