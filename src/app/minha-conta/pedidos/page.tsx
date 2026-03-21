import { prisma } from "@/lib/prisma";
import { ShoppingBag, Package, Search, Filter, Truck, CheckCircle, Clock, XCircle, ArrowRight, ChevronRight, Box } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Tipos para facilitar
type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

// Helpers de UI
const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any; progress: number }> = {
    'PENDING': { label: 'Aguardando Pagamento', color: 'text-yellow-600 bg-yellow-50 border-yellow-100', icon: Clock, progress: 10 },
    'PAID': { label: 'Pagamento Aprovado', color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle, progress: 30 },
    'SHIPPED': { label: 'Em Trânsito', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Truck, progress: 60 },
    'DELIVERED': { label: 'Entregue', color: 'text-neutral-600 bg-neutral-50 border-neutral-100', icon: Package, progress: 100 },
    'CANCELED': { label: 'Cancelado', color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle, progress: 0 },
};

export default async function MyOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; tab?: string }>;
}) {
    const { q, tab } = await searchParams;
    const currentTab = tab || 'active'; // 'active' ou 'history'

    // 1. Autenticação
    const cookieStore = await cookies();
    const session = cookieStore.get("sanches_session");
    if (!session?.value) redirect("/login");

    // 2. Filtros de Banco de Dados
    const where: any = { userId: Number(session.value) };

    // Filtro de Busca (ID ou Nome do Produto)
    if (q) {
        where.OR = [
            { id: { contains: q } },
            { items: { some: { name: { contains: q, mode: 'insensitive' } } } }
        ];
    }

    // Filtro de Aba
    if (currentTab === 'active') {
        where.status = { in: ['PENDING', 'PAID', 'SHIPPED'] };
    } else {
        where.status = { in: ['DELIVERED', 'CANCELED'] };
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
    });

    // Counts para as abas (Busca separada para mostrar números reais)
    const [activeCount, historyCount] = await Promise.all([
        prisma.order.count({ where: { userId: Number(session.value), status: { in: ['PENDING', 'PAID', 'SHIPPED'] } } }),
        prisma.order.count({ where: { userId: Number(session.value), status: { in: ['DELIVERED', 'CANCELED'] } } })
    ]);

    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-black" /> Galeria de Pedidos
                </h1>
                <p className="text-gray-500 mt-2">Gerencie e rastreie suas aquisições.</p>
            </div>

            {/* Controles (Search & Tabs) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">

                {/* Abas Estilizadas */}
                <div className="flex p-1 bg-gray-100 rounded-2xl w-full md:w-auto">
                    <Link
                        href="/minha-conta/pedidos?tab=active"
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${currentTab === 'active' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                    >
                        Em Andamento
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${currentTab === 'active' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {activeCount}
                        </span>
                    </Link>
                    <Link
                        href="/minha-conta/pedidos?tab=history"
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${currentTab === 'history' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                    >
                        Histórico
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${currentTab === 'history' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {historyCount}
                        </span>
                    </Link>
                </div>

                {/* Busca */}
                <form className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por nº do pedido ou produto..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium"
                    />
                    <input type="hidden" name="tab" value={currentTab} />
                </form>
            </div>

            {/* Lista de Pedidos */}
            <div className="space-y-6">
                {orders.map((order) => {
                    const status = statusConfig[order.status as OrderStatus] || statusConfig['PENDING'];
                    const StatusIcon = status.icon;
                    const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

                    return (
                        <div key={order.id} className="group bg-white rounded-[32px] border border-gray-100 p-1 hover:shadow-xl hover:border-gray-200 transition-all duration-300">

                            <div className="p-6 md:p-8">
                                {/* Header do Card */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl border ${status.color}`}>
                                            <StatusIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-gray-900 text-lg">Pedido #{order.id.slice(0, 8)}</h3>
                                                <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
                                                    {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className={`text-sm font-bold mt-0.5 ${status.color.split(' ')[0]}`}>
                                                {status.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Total</p>
                                        <p className="text-xl font-black text-gray-900">{formatMoney(Number(order.total))}</p>
                                    </div>
                                </div>

                                {/* Barra de Progresso (Visual Only) */}
                                {order.status !== 'CANCELED' && (
                                    <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${order.status === 'DELIVERED' ? 'bg-black' : 'bg-yellow-400'}`}
                                            style={{ width: `${status.progress}%` }}
                                        ></div>
                                    </div>
                                )}

                                {/* Conteúdo: Itens e Ações */}
                                <div className="flex flex-col lg:flex-row gap-8 items-center">

                                    {/* Galeria de Itens */}
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {order.items.slice(0, 4).map((item) => (
                                                <div key={item.id} className="relative group/item">
                                                    <div className="h-20 w-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                                        {item.product.images[0] ? (
                                                            <img src={item.product.images[0]} className="h-full w-full object-cover mix-blend-multiply" />
                                                        ) : (
                                                            <Box className="h-8 w-8 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="h-20 w-20 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-400 font-bold text-xs">
                                                    <span>+{order.items.length - 4}</span>
                                                    <span>itens</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 font-medium">
                                            {order.items[0].name} {order.items.length > 1 && `e mais ${order.items.length - 1} itens`}
                                        </p>
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                        {/* Botão de Rastreio (se aplicável) */}
                                        {order.status === 'SHIPPED' && order.trackingCode && (
                                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                                <Truck className="h-4 w-4" /> Rastrear
                                            </button>
                                        )}

                                        <Link
                                            href={`/minha-conta/pedidos/${order.id}`} // Futura página de detalhes
                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1"
                                        >
                                            Detalhes <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Footer do Card (Tracking Info) */}
                            {order.trackingCode && (
                                <div className="bg-gray-50 px-8 py-4 rounded-b-[32px] border-t border-gray-100 flex items-center gap-3 text-sm">
                                    <Truck className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Código de Rastreio:</span>
                                    <span className="font-mono font-bold text-gray-900 select-all">{order.trackingCode}</span>
                                </div>
                            )}
                        </div>
                    );
                })}

                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mb-6">
                            <Package className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Nenhum pedido encontrado</h3>
                        <p className="text-gray-500 max-w-xs text-center mt-2 mb-8">
                            {currentTab === 'active'
                                ? "Você não tem pedidos em andamento no momento."
                                : "Seu histórico de pedidos está vazio."}
                        </p>
                        <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                            Começar a Comprar
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}