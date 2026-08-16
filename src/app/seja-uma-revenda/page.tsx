import type { Metadata } from 'next';
import SejaRevendaClient from './SejaRevendaClient';

export const metadata: Metadata = {
  title: 'Seja uma Revenda Autorizada',
  description: 'Seja um revendedor autorizado Macsport. Ofereça os melhores equipamentos fitness do Brasil com alta rentabilidade e suporte total da fábrica.',
  openGraph: {
    title: 'Seja uma Revenda Autorizada',
    description: 'Seja um revendedor autorizado Macsport. Ofereça os melhores equipamentos fitness do Brasil com alta rentabilidade e suporte total da fábrica.',
  },
};

export default function SejaRevendaPage() {
  return <SejaRevendaClient />;
}
