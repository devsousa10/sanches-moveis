import Link from "next/link";
import { Facebook, Instagram, MapPin, MessageCircle, Mail, Clock, CreditCard, ShieldCheck } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-neutral-900 text-gray-300 border-t border-neutral-800">
            {/* --- FAIXA DE DESTAQUE (Serviços) --- */}
            <div className="bg-yellow-600 text-black py-4">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                        <MapPin className="h-5 w-5" />
                        <span>Entrega e Montagem <span className="underline">GRÁTIS</span> em toda Osasco-SP</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                        <ShieldCheck className="h-5 w-5" />
                        <span>Compra 100% Segura e Garantida</span>
                    </div>
                </div>
            </div>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* COLUNA 1: SOBRE A LOJA */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="bg-red-700 text-yellow-400 p-1 rounded">★</span>
                            Sanches Móveis
                        </h3>
                        <p className="text-sm leading-relaxed mb-6 text-gray-400">
                            Transformando casas em lares com móveis de alta qualidade e design exclusivo.
                            Especialistas em conforto e atendimento humanizado.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="https://instagram.com/sanches_empresa"
                                target="_blank"
                                className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* COLUNA 2: ATENDIMENTO */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Central de Atendimento</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MessageCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase">WhatsApp (Dúvidas)</span>
                                    <a href="https://wa.me/5511954468385" target="_blank" className="text-white hover:text-green-400 font-medium">
                                        (11) 95446-8385
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase">E-mail</span>
                                    <a href="mailto:estrelamoveis1012@outlook.com" className="hover:text-yellow-500 transition-colors">
                                        estrelamoveis1012@outlook.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase">Horário</span>
                                    <span>Seg a Sex: 9h às 18h<br />Sáb: 9h às 14h</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* COLUNA 3: INSTITUCIONAL / LINKS */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Institucional</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/sobre" className="hover:text-yellow-500 transition-colors">Quem Somos</Link>
                            </li>
                            <li>
                                <Link href="/politica-entrega" className="hover:text-yellow-500 transition-colors">Política de Entrega</Link>
                            </li>
                            <li>
                                <Link href="/trocas-devolucoes" className="hover:text-yellow-500 transition-colors">Trocas e Devoluções</Link>
                            </li>
                            <li>
                                <Link href="/privacidade" className="hover:text-yellow-500 transition-colors">Política de Privacidade</Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-neutral-600 hover:text-neutral-400 text-xs mt-4 block">
                                    Área do Lojista
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUNA 4: LOCALIZAÇÃO */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Onde Estamos</h3>
                        <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                            <div className="flex gap-3 mb-3">
                                <MapPin className="h-6 w-6 text-red-500 shrink-0" />
                                <address className="text-sm not-italic text-gray-400">
                                    <strong className="text-white block mb-1">Loja Física</strong>
                                    Rua Agudos, 445, Letra A<br />
                                    Rochdale, Osasco - SP<br />
                                    CEP: 06223-140
                                </address>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Rua+Agudos,+445,+Rochdale,+Osasco+-+SP"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-white/10 text-white text-xs font-bold py-2 rounded hover:bg-white/20 transition-colors"
                            >
                                Ver no Mapa
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- RODAPÉ INFERIOR --- */}
            <div className="bg-black py-6 border-t border-neutral-800">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                    <p>
                        © {new Date().getFullYear()} Sanches Móveis e Decorações. Todos os direitos reservados.
                        <br className="hidden md:block" />
                        CNPJ: Não informado no momento.
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="uppercase font-bold tracking-widest text-[10px]">Pagamento Seguro</span>
                        <div className="flex gap-2">
                            {/* Ícones Simulados de Pagamento */}
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center"><CreditCard className="h-4 w-4 text-black" /></div>
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center font-bold text-black text-[10px]">PIX</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}