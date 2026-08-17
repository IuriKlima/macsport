import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade da Macsport",
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl font-bold mb-8 text-black">Política de Privacidade</h1>
      <div className="prose prose-lg text-gray-700">
        <p className="mb-4">
          A Macsport respeita a sua privacidade e garante o sigilo total das informações que você nos fornece.
          Seus dados pessoais são armazenados em nosso banco de dados com o intuito de melhorar nosso relacionamento através de e-mail, mala-direta, telemarketing, entre outras formas de interação. Assim, podemos sempre lhe oferecer os melhores produtos e serviços.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">1. Coleta de Informações</h2>
        <p className="mb-4">
          Coletamos informações fornecidas por você durante o cadastro, orçamento ou compra de produtos, bem como informações geradas automaticamente pela sua navegação no site (como endereço IP, cookies, páginas acessadas).
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">2. Uso das Informações</h2>
        <p className="mb-4">
          As informações coletadas são utilizadas para:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornecer, operar e melhorar nossos serviços;</li>
          <li>Processar transações e enviar avisos sobre as mesmas;</li>
          <li>Enviar comunicações de marketing e novidades (que você pode optar por não receber);</li>
          <li>Responder a dúvidas e solicitações de suporte.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">3. Compartilhamento de Informações</h2>
        <p className="mb-4">
          Não comercializamos ou compartilhamos seus dados pessoais com terceiros, exceto quando necessário para o processo de entrega, cobrança, ou por determinação legal.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">4. Cookies</h2>
        <p className="mb-4">
          Utilizamos cookies para reconhecer seu navegador ou dispositivo, aprender mais sobre seus interesses e fornecer recursos e serviços essenciais. Você pode configurar seu navegador para recusar cookies, mas isso pode limitar algumas funcionalidades do site.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">5. Segurança</h2>
        <p className="mb-4">
          Adotamos medidas de segurança apropriadas para proteger contra acesso não autorizado, alteração, divulgação ou destruição dos seus dados pessoais.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">6. Direitos do Usuário</h2>
        <p className="mb-4">
          Você tem o direito de solicitar acesso, correção ou exclusão de seus dados pessoais a qualquer momento, entrando em contato conosco através dos nossos canais oficiais.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>
    </div>
  );
}
