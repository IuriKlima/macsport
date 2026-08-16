import type { Metadata } from 'next';
import TrabalheConoscoClient from './TrabalheConoscoClient';

export const metadata: Metadata = {
  title: 'Trabalhe Conosco',
  description: 'Faça parte da equipe Macsport. Envie seu currículo e junte-se a nós.',
  openGraph: {
    title: 'Trabalhe Conosco',
    description: 'Faça parte da equipe Macsport. Envie seu currículo e junte-se a nós.',
  },
};

export default function TrabalheConoscoPage() {
  return <TrabalheConoscoClient />;
}
