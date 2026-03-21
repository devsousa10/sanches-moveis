import { Lock, Eye, Database, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-neutral-950 min-h-screen text-neutral-300 selection:bg-yellow-500 selection:text-black">
            {/* Header */}
            <div className="bg-neutral-900 py-16 border-b border-neutral-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-6 text-yellow-500">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                        Política de <span className="text-yellow-500">Privacidade</span>
                    </h1>
                    <p className="text-lg text-neutral-400">
                        Respeitamos seus dados. Saiba como cuidamos da sua segurança.
                    </p>
                </div>
            </div>

            {/* Conteúdo Texto Corrido (Prose) */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-12">

                    <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-bold text-white">Coleta de Dados</h2>
                        </div>
                        <p className="leading-relaxed text-neutral-400">
                            Coletamos apenas as informações necessárias para processar seu pedido e melhorar sua experiência de compra. Isso inclui: nome, CPF, endereço de entrega, e-mail e telefone. Seus dados de cartão de crédito são processados diretamente pelo gateway de pagamento e não ficam salvos em nossos servidores.
                        </p>
                    </div>

                    <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-bold text-white">Uso das Informações</h2>
                        </div>
                        <p className="leading-relaxed text-neutral-400 mb-4">
                            Utilizamos seus dados para:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-400 ml-4">
                            <li>Processar e entregar seus pedidos.</li>
                            <li>Enviar atualizações sobre o status da entrega.</li>
                            <li>Responder a dúvidas e solicitações de suporte.</li>
                            <li>Enviar promoções e novidades (apenas se autorizado).</li>
                        </ul>
                    </div>

                    <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-bold text-white">Cookies e Tecnologias</h2>
                        </div>
                        <p className="leading-relaxed text-neutral-400">
                            Utilizamos cookies para personalizar sua navegação, lembrar itens do seu carrinho e entender como você interage com nosso site. Você pode gerenciar as preferências de cookies diretamente nas configurações do seu navegador.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}