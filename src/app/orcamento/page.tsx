import type { Metadata } from 'next';
import OrcamentoClient from './OrcamentoClient';

export const metadata: Metadata = {
  title: 'Solicitar Orçamento',
  description: 'Monte seu orçamento personalizado de equipamentos Macsport para sua academia ou studio.',
  openGraph: {
    title: 'Solicitar Orçamento',
    description: 'Monte seu orçamento personalizado de equipamentos Macsport para sua academia ou studio.',
  },
};

export default function OrcamentoPage() {
  return <OrcamentoClient />;
}
