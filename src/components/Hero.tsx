import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative bg-black py-20 text-white md:py-32">
            {/* Imagem de Fundo Abstrata */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800 opacity-90" />
            </div>

            <div className="container relative mx-auto flex flex-col items-start px-4 md:px-6">
                {/* Badge de Oferta */}
                <div className="mb-4 inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    Ofertas de Inauguração
                </div>

                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                    Design exclusivo para <br />
                    o seu <span className="text-yellow-400">conforto</span>.
                </h1>

                <p className="mt-6 max-w-lg text-lg text-gray-400">
                    Móveis com acabamento premium e entrega garantida.
                    Renove sua casa com a qualidade Sanches Móveis.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    {/* Botão Principal -> Aponta para /ofertas */}
                    <Link
                        href="/ofertas"
                        className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-8 py-3 text-base font-bold text-black shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-transform hover:scale-105 hover:bg-yellow-400"
                    >
                        Ver Ofertas Agora
                    </Link>

                    {/* Botão Secundário -> Aponta para /sobre */}
                    <Link
                        href="/sobre"
                        className="inline-flex items-center justify-center rounded-full border border-gray-700 bg-transparent px-8 py-3 text-base font-medium text-white transition-colors hover:border-yellow-400 hover:text-yellow-400"
                    >
                        Conheça a Loja <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}