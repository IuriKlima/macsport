import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Dicas de gestão, novidades do mercado fitness e conteúdos exclusivos sobre equipamentos, montagem de academias e performance.',
  openGraph: {
    title: 'Blog',
    description: 'Dicas de gestão, novidades do mercado fitness e conteúdos exclusivos sobre equipamentos, montagem de academias e performance.',
  },
};

export const revalidate = 60;

export default function BlogPage() {
  return <BlogClient />;
}
