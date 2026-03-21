import { prisma } from "@/lib/prisma";
import { DollarSign, Package, Users, TrendingUp, TrendingDown, ShoppingBag, ArrowUpRight, ArrowRight, Star, AlertTriangle, Calendar, Activity, MessageSquare } from "lucide-react";
import Link from "next/link";
import { OverviewChart } from "@/components/admin/OverviewChart";
import { subDays, startOfDay, endOfDay, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

// Helper para formatar moeda
const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

// Helper para calcular crescimento
const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

export default async function AdminDashboard() {
    const today = new Date();
    const last30DaysStart = subDays(today, 30);
    const prev30DaysStart = subDays(last30DaysStart, 30);

    // --- 1. BUSCA DE DADOS (PARALELA PARA PERFORMANCE) ---
    const [
        currentPeriodOrders,
        previousPeriodOrders,
        currentPeriodRevenue,
        previousPeriodRevenue,
        totalUsers,
        previousTotalUsers,
        recentOrders,
        topProductsRaw,
        lowStockProducts,
        recentReviews // <--- NOVO DADO
    ] = await Promise.all([
        // Pedidos (Atual vs Anterior)
        prisma.order.count({ where: { createdAt: { gte: last30DaysStart } } }),
        prisma.order.count({ where: { createdAt: { gte: prev30DaysStart, lt: last30DaysStart } } }),

        // Faturamento (Atual vs Anterior - Apenas PAGOS)
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: 'PAID', createdAt: { gte: last30DaysStart } }
        }),
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: 'PAID', createdAt: { gte: prev30DaysStart, lt: last30DaysStart } }
        }),

        // Usuários
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { lt: last30DaysStart } } }),

        // Pedidos Recentes
        prisma.order.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        }),

        // Produtos Mais Vendidos (Top 5)
        prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 4,
            where: { order: { status: 'PAID', createdAt: { gte: last30DaysStart } } }
        }),

        // Estoque Baixo
        prisma.product.findMany({
            where: { stock: { lte: 5 }, isActive: true },
            take: 3,
            select: { id: true, name: true, stock: true, images: true }
        }),

        // Avaliações Recentes (NOVO)
        prisma.review.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
            include: { user: true, product: true }
        })
    ]);

    // --- 2. PROCESSAMENTO DE DADOS ---

    // Métricas Financeiras
    const revenueCurrent = Number(currentPeriodRevenue._sum.total || 0);
    const revenuePrev = Number(previousPeriodRevenue._sum.total || 0);
    const revenueGrowth = calculateGrowth(revenueCurrent, revenuePrev);

    const ordersGrowth = calculateGrowth(currentPeriodOrders, previousPeriodOrders);

    // Ticket Médio
    const avgTicketCurrent = currentPeriodOrders > 0 ? revenueCurrent / currentPeriodOrders : 0;
    const avgTicketPrev = previousPeriodOrders > 0 ? revenuePrev / previousPeriodOrders : 0;
    const avgTicketGrowth = calculateGrowth(avgTicketCurrent, avgTicketPrev);

    // Dados do Gráfico (Últimos 7 dias)
    const graphData = await Promise.all(
        Array.from({ length: 7 }).map(async (_, i) => {
            const date = subDays(today, 6 - i);
            const start = startOfDay(date);
            const end = endOfDay(date);

            const dayRevenue = await prisma.order.aggregate({
                _sum: { total: true },
                where: { status: 'PAID', createdAt: { gte: start, lte: end } }
            });

            return {
                name: format(date, 'dd/MM'),
                total: Number(dayRevenue._sum.total || 0)
            };
        })
    );

    // Resolver Nomes dos Produtos Mais Vendidos
    const topProducts = await Promise.all(topProductsRaw.map(async (item) => {
        const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { name: true, images: true, price: true }
        });
        return {
            ...item,
            name: product?.name || "Produto Removido",
            image: product?.images[0] || null,
            price: Number(product?.price || 0)
        };
    }));

    // --- 3. UI COMPONENTS ---

    const KPI = ({ title, value, growth, icon: Icon, prefix = "" }: any) => {
        const isPositive = growth >= 0;
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6" />
                    </div>
                    {growth !== 0 && (
                        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {Math.abs(growth).toFixed(0)}%
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900">{prefix}{value}</h3>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Visão Geral <Activity className="h-8 w-8 text-black" />
                    </h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Dados dos últimos 30 dias
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/produtos/novo" className="bg-white text-black border border-gray-200 px-5 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-colors text-sm">
                        + Produto
                    </Link>
                    <Link href="/admin/pedidos" className="bg-black text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-gray-900 hover:-translate-y-1 transition-all text-sm">
                        Ver Pedidos
                    </Link>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPI
                    title="Receita Total"
                    value={formatMoney(revenueCurrent)}
                    growth={revenueGrowth}
                    icon={DollarSign}
                />
                <KPI
                    title="Pedidos Realizados"
                    value={currentPeriodOrders}
                    growth={ordersGrowth}
                    icon={ShoppingBag}
                />
                <KPI
                    title="Ticket Médio"
                    value={formatMoney(avgTicketCurrent)}
                    growth={avgTicketGrowth}
                    icon={Package}
                />
                <KPI
                    title="Clientes Totais"
                    value={totalUsers}
                    growth={calculateGrowth(totalUsers, previousTotalUsers)}
                    icon={Users}
                />
            </div>

            {/* Grid 1: Gráfico e Top Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Gráfico Principal (2/3) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Performance de Vendas</h3>
                            <p className="text-sm text-gray-400">Receita diária nos últimos 7 dias</p>
                        </div>
                        <div className="p-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Alta Demanda
                        </div>
                    </div>
                    <OverviewChart data={graphData} />
                </div>

                {/* Top Produtos (1/3) */}
                <div className="bg-black text-white p-6 rounded-3xl shadow-xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 z-10">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        Top Sellers
                    </h3>

                    <div className="flex-1 space-y-4 z-10">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center gap-4 group">
                                <div className="font-mono text-2xl font-black text-gray-700 group-hover:text-yellow-400 transition-colors">
                                    0{index + 1}
                                </div>
                                <div className="h-10 w-10 bg-white/10 rounded-lg overflow-hidden border border-white/10">
                                    {product.image && <img src={product.image} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{product.name}</p>
                                    <p className="text-xs text-gray-400">{product._sum.quantity} vendidos</p>
                                </div>
                                <div className="text-sm font-bold text-yellow-400">
                                    {formatMoney(product.price)}
                                </div>
                            </div>
                        ))}
                        {topProducts.length === 0 && (
                            <p className="text-gray-500 text-sm">Nenhum dado de venda ainda.</p>
                        )}
                    </div>

                    <Link href="/admin/produtos" className="mt-6 text-xs text-center font-bold text-gray-400 hover:text-white transition-colors z-10">
                        VER CATÁLOGO COMPLETO
                    </Link>
                </div>
            </div>

            {/* Grid 2: Pedidos Recentes e Alertas de Estoque */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Pedidos Recentes (Lista Rica) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Atividade Recente</h3>
                        <Link href="/admin/pedidos" className="flex items-center gap-1 text-xs font-bold text-black hover:underline">
                            Ver todos <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {order.status === 'PAID' ? '$' : '#'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
                                        <p className="font-mono text-xs text-gray-400">{format(order.createdAt, 'HH:mm')}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Novo pedido de <span className="text-black font-bold">{formatMoney(Number(order.total))}</span>
                                        <span className="mx-2">•</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </p>
                                </div>
                                <Link href={`/admin/pedidos/${order.id}`} className="p-2 text-gray-300 hover:text-black hover:bg-white rounded-full transition-all">
                                    <ArrowUpRight className="h-5 w-5" />
                                </Link>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <div className="p-10 text-center text-gray-400 text-sm">Nenhum pedido recente.</div>
                        )}
                    </div>
                </div>

                {/* Alertas de Estoque */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
                        <div className="flex items-center gap-2 mb-6 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            <h3 className="text-lg font-bold text-gray-900">Atenção ao Estoque</h3>
                        </div>

                        <div className="space-y-4">
                            {lowStockProducts.map(product => (
                                <div key={product.id} className="flex gap-4 p-3 bg-red-50 rounded-2xl border border-red-100 items-center">
                                    <div className="h-12 w-12 bg-white rounded-xl overflow-hidden shrink-0">
                                        {product.images[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-gray-900 truncate">{product.name}</p>
                                        <p className="text-xs text-red-600 font-bold">Apenas {product.stock} un. restantes</p>
                                    </div>
                                    <Link
                                        href={`/admin/produtos/${product.id}`}
                                        className="text-xs bg-white text-red-600 px-3 py-1.5 rounded-lg font-bold shadow-sm hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        Repor
                                    </Link>
                                </div>
                            ))}

                            {lowStockProducts.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <p className="text-gray-900 font-bold">Tudo sob controle!</p>
                                    <p className="text-xs text-gray-500 mt-1">Nenhum produto com estoque crítico.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid 3: Avaliações Recentes (NOVO BLOCO - MANTENDO OS ANTERIORES) */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-gray-400" /> Feedback Recente
                        </h3>
                        <Link href="/admin/avaliacoes" className="text-xs font-bold text-blue-600 hover:underline">Ver todas</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentReviews.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-400 text-sm">Nenhuma avaliação recente.</div>
                        ) : (
                            recentReviews.map(review => (
                                <div key={review.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-700">
                                                    {review.user.name.substring(0, 1).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-xs text-gray-900 truncate max-w-[100px]">{review.user.name}</span>
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 italic line-clamp-2 mb-3 min-h-[32px]">"{review.comment}"</p>
                                    </div>

                                    <div className="pt-3 border-t border-gray-200 flex items-center gap-2">
                                        <div className="h-6 w-6 bg-white rounded-md overflow-hidden border border-gray-200 shrink-0">
                                            {review.product.images[0] && <img src={review.product.images[0]} className="w-full h-full object-cover" />}
                                        </div>
                                        <Link href={`/produto/${review.product.slug}`} className="text-[10px] font-bold text-gray-900 hover:underline truncate">
                                            {review.product.name}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}