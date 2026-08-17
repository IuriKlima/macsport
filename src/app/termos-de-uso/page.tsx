import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso da Macsport",
};

export default function TermosUsoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl font-bold mb-8 text-black">Termos de Uso</h1>
      <div className="prose prose-lg text-gray-700">
        <p className="mb-4">
          Ao acessar e utilizar o site da Macsport, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">1. Uso de Licença</h2>
        <p className="mb-4">
          É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site da Macsport, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Modificar ou copiar os materiais;</li>
          <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
          <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site;</li>
          <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">2. Isenção de Responsabilidade</h2>
        <p className="mb-4">
          Os materiais no site da Macsport são fornecidos "como estão". A Macsport não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">3. Limitações</h2>
        <p className="mb-4">
          Em nenhum caso a Macsport ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Macsport, mesmo que a Macsport ou um representante autorizado tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">4. Precisão dos materiais</h2>
        <p className="mb-4">
          Os materiais exibidos no site da Macsport podem incluir erros técnicos, tipográficos ou fotográficos. A Macsport não garante que qualquer material em seu site seja preciso, completo ou atual. A Macsport pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-black">5. Modificações</h2>
        <p className="mb-4">
          A Macsport pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>
    </div>
  );
}
