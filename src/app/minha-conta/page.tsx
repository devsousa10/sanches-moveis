import { prisma } from "@/lib/prisma";
import { Package, MapPin, Heart, ChevronRight, Truck, Star, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CustomerDashboard() {
    // 1. Autenticação e Dados
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");

    // Se não tem cookie, vai pro login (Middleware já deve ter tratado, mas garantimos)
    if (!session?.value) redirect("/login");

    const userId = Number(session.value);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { items: { include: { product: true } } }
            },
            wishlist: { take: 4 },
            addresses: { take: 1, orderBy: { id: 'desc' } },
            _count: { select: { wishlist: true, orders: true } }
        }
    });

    // --- CORREÇÃO DO LOOP INFINITO ---
    // Se o cookie existe mas o usuário não está no banco (foi deletado ou banco resetado),
    // redirecionamos para a rota de logout para limpar o cookie viciado.
    if (!user) {
        redirect("/api/logout");
    }

    // 2. Lógica de "Gamification" (Nível VIP)
    const totalSpent = user.orders.reduce((acc, order) => acc + Number(order.total), 0);
    let memberTier = "MEMBER";
    let tierColor = "from-gray-700 to-gray-900";
    let tierIcon = <User className="h-5 w-5 text-gray-400" />;

    if (totalSpent > 5000) {
        memberTier = "GOLD";
        tierColor = "from-yellow-400 to-yellow-600";
        tierIcon = <Star className="h-5 w-5 text-yellow-100" />;
    } else if (totalSpent > 2000) {
        memberTier = "SILVER";
        tierColor = "from-slate-400 to-slate-600";
        tierIcon = <ShieldCheck className="h-5 w-5 text-white" />;
    }

    // Último pedido ativo (para destaque)
    const activeOrder = user.orders.find(o => ['PAID', 'SHIPPED'].includes(o.status));

    // Helpers
    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="space-y-8 pb-20">

            {/* --- HEADER & MEMBER CARD --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Saudação */}
                <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Bem-vindo de volta, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700">
                                {user.name.split(" ")[0]}
                            </span>.
                        </h1>
                        <p className="text-gray-500 text-lg max-w-md">
                            Seu painel pessoal está pronto. Você tem <strong className="text-black">{user._count.wishlist} itens</strong> na sua lista de desejos.
                        </p>
                    </div>

                    {/* Atalhos Rápidos */}
                    <div className="flex gap-3">
                        <Link href="/" className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-900 transition-all flex items-center gap-2 hover:-translate-y-1">
                            Ir às Compras <ChevronRight className="h-4 w-4" />
                        </Link>
                        <Link href="/minha-conta/pedidos" className="bg-white text-black border border-gray-200 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all">
                            Meus Pedidos
                        </Link>
                    </div>
                </div>

                {/* O CARTÃO DE MEMBRO */}
                <div className={`relative h-56 rounded-[32px] bg-gradient-to-br ${tierColor} shadow-2xl p-6 flex flex-col justify-between overflow-hidden group`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Status da Conta</p>
                            <h3 className="text-2xl font-black text-white tracking-widest">{memberTier}</h3>
                        </div>
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                            {tierIcon}
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-white/80 font-mono text-sm mb-1 tracking-widest">
                            **** **** **** {user.id.toString().padStart(4, '0')}
                        </p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold text-white/60 uppercase">Membro Desde</p>
                                <p className="text-white font-medium text-sm">{new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase()}</p>
                            </div>
                            {totalSpent > 0 && (
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-white/60 uppercase">Total Investido</p>
                                    <p className="text-white font-bold">{formatMoney(totalSpent)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ACTIVE ORDER WIDGET --- */}
            {activeOrder && (
                <div className="bg-white rounded-[32px] border border-blue-100 shadow-xl shadow-blue-50/50 p-1 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                            <Truck className="h-8 w-8 text-blue-600 animate-pulse" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                                    Em Trânsito
                                </span>
                                <span className="text-xs text-gray-400 font-mono">#{activeOrder.id.slice(0, 8)}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Seu pedido está a caminho!</h3>
                            <p className="text-gray-500 text-sm">
                                {activeOrder.trackingCode
                                    ? `Rastreio: ${activeOrder.trackingCode}`
                                    : "Preparando para envio..."}
                            </p>
                        </div>
                        <Link href={`/minha-conta/pedidos`} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all whitespace-nowrap">
                            Rastrear Agora
                        </Link>
                    </div>
                </div>
            )}

            {/* --- GRID DE CONTEÚDO --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. ÚLTIMOS PEDIDOS */}
                <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-400" /> Histórico Recente
                        </h3>
                        <Link href="/minha-conta/pedidos" className="text-xs font-bold text-black hover:underline">Ver todos</Link>
                    </div>

                    <div className="space-y-4">
                        {user.orders.length > 0 ? user.orders.map((order) => (
                            <div key={order.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-default">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {order.status === 'PAID' ? '$' : '#'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-bold text-gray-900 text-sm">Pedido #{order.id.slice(0, 5)}</p>
                                        <p className="font-mono text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                                        <p className="text-xs font-bold text-black">{formatMoney(Number(order.total))}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                Nenhuma compra recente.
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. SIDE WIDGETS */}
                <div className="space-y-8">

                    {/* WIDGET: Favoritos */}
                    <div className="bg-neutral-900 text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="font-bold flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500 fill-red-500" /> Wishlist
                            </h3>
                            <Link href="/minha-conta/desejos" className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">
                                VER {user._count.wishlist}
                            </Link>
                        </div>

                        {user.wishlist.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                {user.wishlist.slice(0, 4).map(product => (
                                    <Link key={product.id} href={`/produto/${product.slug}`} className="aspect-square bg-white rounded-xl p-2 flex items-center justify-center hover:scale-105 transition-transform">
                                        {product.images[0] ? (
                                            <img src={product.images[0]} className="w-full h-full object-contain mix-blend-multiply" alt={product.name} />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 rounded-lg"></div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-white/50 text-xs">
                                Sua lista está vazia.
                            </div>
                        )}
                    </div>

                    {/* WIDGET: Endereço Padrão */}
                    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors"></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-gray-50 rounded-full">
                                <MapPin className="h-5 w-5 text-gray-900" />
                            </div>
                            <Link href="/minha-conta/enderecos" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="relative z-10">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Entregar em</p>
                            {user.addresses[0] ? (
                                <>
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{user.addresses[0].name}</h4>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {user.addresses[0].street}, {user.addresses[0].number}
                                        <br />
                                        {user.addresses[0].city} - {user.addresses[0].state}
                                    </p>
                                </>
                            ) : (
                                <Link href="/minha-conta/enderecos/novo" className="block text-sm font-bold text-blue-600 hover:underline">
                                    + Adicionar Endereço
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}