import { RefreshCcw, AlertTriangle, CheckCircle, Shield } from "lucide-react";

export default function ReturnsPolicyPage() {
    return (
        <div className="bg-neutral-950 min-h-screen text-neutral-300 selection:bg-yellow-500 selection:text-black">
            {/* Header */}
            <div className="bg-neutral-900 py-16 border-b border-neutral-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-6 text-yellow-500">
                        <RefreshCcw className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                        Trocas e <span className="text-yellow-500">Devoluções</span>
                    </h1>
                    <p className="text-lg text-neutral-400">
                        Sua satisfação é nossa prioridade. Processo simples e transparente.
                    </p>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

                {/* Card: Arrependimento */}
                <section className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 hover:border-yellow-500/30 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-neutral-800 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Direito de Arrependimento</h2>
                            <p className="leading-relaxed mb-4">
                                Conforme o Código de Defesa do Consumidor, você tem até <strong className="text-white">7 (sete) dias corridos</strong> após o recebimento do produto para solicitar a devolução por arrependimento, sem necessidade de justificativa.
                            </p>
                            <ul className="text-sm space-y-2 text-neutral-400 bg-black/20 p-4 rounded-lg">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> O produto deve estar na embalagem original.</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Sem indícios de uso ou montagem.</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Acompanhado de manual e nota fiscal.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Card: Defeito */}
                <section className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 hover:border-yellow-500/30 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-neutral-800 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Produto com Defeito</h2>
                            <p className="leading-relaxed mb-4">
                                Caso identifique algum defeito de fabricação dentro do prazo de garantia (90 dias legais), entre em contato conosco.
                            </p>
                            <p className="text-neutral-400">
                                Faremos a análise técnica e, constatado o defeito, providenciaremos o reparo, a troca da peça ou a substituição do produto sem custos adicionais.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Como Solicitar */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Como solicitar?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 text-center">
                            <span className="text-5xl font-black text-neutral-800 mb-4 block">1</span>
                            <p className="font-medium text-white">Entre em contato</p>
                            <p className="text-sm text-neutral-500 mt-2">Envie e-mail para suporte@sanches.com ou use o chat.</p>
                        </div>
                        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 text-center">
                            <span className="text-5xl font-black text-neutral-800 mb-4 block">2</span>
                            <p className="font-medium text-white">Análise</p>
                            <p className="text-sm text-neutral-500 mt-2">Nossa equipe analisará sua solicitação em até 48h.</p>
                        </div>
                        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 text-center">
                            <span className="text-5xl font-black text-neutral-800 mb-4 block">3</span>
                            <p className="font-medium text-white">Resolução</p>
                            <p className="text-sm text-neutral-500 mt-2">Enviaremos o código de postagem ou coleta.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}