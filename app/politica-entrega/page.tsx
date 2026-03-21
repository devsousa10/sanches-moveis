import { Truck, Clock, MapPin, PackageCheck, Hammer } from "lucide-react";

export default function ShippingPolicyPage() {
    return (
        <div className="bg-neutral-950 min-h-screen text-neutral-300 selection:bg-yellow-500 selection:text-black">
            {/* Header */}
            <div className="bg-neutral-900 py-16 border-b border-neutral-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-6 text-yellow-500">
                        <Truck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                        Política de <span className="text-yellow-500">Entrega</span>
                    </h1>
                    <p className="text-lg text-neutral-400">
                        Agilidade e exclusividade para nossos clientes de Osasco.
                    </p>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

                {/* Seção 1: Abrangência Local */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold text-white">Onde Entregamos?</h2>
                    </div>
                    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 border-l-4 border-l-yellow-500">
                        <p className="leading-relaxed text-lg text-white">
                            Atualmente, realizamos entregas e montagens <strong>exclusivamente na cidade de Osasco - SP</strong>.
                        </p>
                        <p className="text-neutral-400 mt-2">
                            Isso nos permite garantir um atendimento personalizado, prazos recordes e um cuidado especial com o seu móvel.
                        </p>
                    </div>
                </section>

                {/* Seção 2: Montagem Grátis (Diferencial) */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Hammer className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold text-white">Montagem Grátis</h2>
                    </div>
                    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                        <p className="leading-relaxed">
                            Para toda a região de Osasco, oferecemos o serviço de <strong className="text-yellow-500">MONTAGEM GRÁTIS</strong>.
                        </p>
                        <ul className="mt-4 space-y-2 list-disc list-inside text-neutral-400">
                            <li>A montagem é agendada após a entrega dos volumes.</li>
                            <li>Nossos montadores são profissionais especializados e de confiança.</li>
                            <li>Deixamos seu móvel pronto para uso, sem dor de cabeça.</li>
                        </ul>
                    </div>
                </section>

                {/* Seção 3: Prazos */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold text-white">Prazos de Entrega</h2>
                    </div>
                    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                        <p className="leading-relaxed mb-4">
                            Por atuarmos localmente, nossos prazos são otimizados. O prazo estimado é exibido no carrinho, mas geralmente seguimos:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-neutral-800">
                                <span className="text-yellow-500 font-bold">Pronta Entrega:</span>
                                <span>1 a 3 dias úteis.</span>
                            </li>
                            <li className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-neutral-800">
                                <span className="text-yellow-500 font-bold">Sob Encomenda:</span>
                                <span>Consulte na página do produto (média de 15 dias).</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Seção 4: Recebimento */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <PackageCheck className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold text-white">Recebimento</h2>
                    </div>
                    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
                        <p className="leading-relaxed">
                            É necessário ter uma pessoa responsável no local para receber a mercadoria. Verifique as dimensões do produto para garantir que ele passe por portas e corredores.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
}