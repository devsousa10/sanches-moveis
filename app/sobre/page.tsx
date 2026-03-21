import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-neutral-950 min-h-screen text-white selection:bg-yellow-500 selection:text-black">
            {/* Hero Section da Página Sobre */}
            <section className="relative py-24 px-4 overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-neutral-950 to-neutral-950 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium mb-6">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span>Excelência desde 2020</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Nossa <span className="text-yellow-500">História</span> & <span className="text-yellow-500">Paixão</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Mais do que móveis, entregamos design, conforto e exclusividade para transformar sua casa no seu lugar favorito no mundo.
                    </p>
                </div>
            </section>

            {/* Seção: A Marca */}
            <section className="py-16 px-4 border-t border-neutral-900 bg-neutral-900/30">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                A <span className="text-yellow-500">Sanches Móveis</span>
                            </h2>
                            <div className="h-1.5 w-24 bg-yellow-500 rounded-full" />
                        </div>

                        <div className="space-y-4 text-neutral-300 leading-relaxed text-lg">
                            <p>
                                Fundada com o objetivo de revolucionar o mercado de mobiliário, a Sanches Móveis nasceu da necessidade de unir <strong className="text-white">alta qualidade</strong>, <strong className="text-white">design sofisticado</strong> e preços justos.
                            </p>
                            <p>
                                Acreditamos que cada peça conta uma história. Nossos móveis são selecionados rigorosamente para garantir durabilidade e um visual impecável, mantendo a essência moderna que você procura.
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/produto"
                                className="inline-flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-400 transition-colors group text-lg"
                            >
                                Ver Nossos Produtos
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Visual Decorativo */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Image src="/window.svg" alt="Ícone Loja" width={40} height={40} className="opacity-50" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-200">Design Studio</h3>
                                <p className="text-neutral-500 mt-2">Onde a mágica acontece</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção: Por que nos escolher (Valores) */}
            <section className="py-24 px-4 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a <span className="text-yellow-500">Sanches</span>?</h2>
                        <p className="text-neutral-400 text-lg">Excelência em cada detalhe, do pedido à entrega.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ValueCard
                            icon={<Star className="w-6 h-6 text-black" />}
                            title="Qualidade Premium"
                            description="Materiais de primeira linha e acabamento impecável em cada detalhe."
                        />
                        <ValueCard
                            icon={<Truck className="w-6 h-6 text-black" />}
                            title="Entrega Rápida"
                            description="Logística eficiente e segura para Osasco-SP."
                        />
                        <ValueCard
                            icon={<ShieldCheck className="w-6 h-6 text-black" />}
                            title="Garantia Total"
                            description="Compra 100% segura com garantia estendida em todos os produtos."
                        />
                        <ValueCard
                            icon={<Clock className="w-6 h-6 text-black" />}
                            title="Atendimento 24h"
                            description="Equipe dedicada pronta para ajudar você a qualquer momento."
                        />
                    </div>
                </div>
            </section>

            {/* Estatísticas */}
            <section className="py-20 bg-yellow-500 text-black">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-black/10">
                    <StatItem number="2020" label="Ano de Fundação" />
                    <StatItem number="+10k" label="Clientes Felizes" />
                    <StatItem number="+500" label="Produtos Exclusivos" />
                    <StatItem number="4.9" label="Avaliação Média" />
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 px-4 text-center bg-neutral-900">
                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">
                    Pronto para renovar seu ambiente?
                </h2>
                <Link
                    href="/produto"
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    Explorar Catálogo Completo
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </section>
        </div>
    );
}

// Componentes Auxiliares
function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 hover:border-yellow-500/50 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-3 text-white group-hover:text-yellow-500 transition-colors">{title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function StatItem({ number, label }: { number: string, label: string }) {
    return (
        <div className="space-y-1 px-4">
            <p className="text-4xl md:text-5xl font-black tracking-tight">{number}</p>
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-70">{label}</p>
        </div>
    );
}