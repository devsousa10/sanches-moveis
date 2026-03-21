import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";
import { ArrowRight, Star, Truck, CreditCard, ShieldCheck, Box } from "lucide-react";
import Image from "next/image";
import { prisma, withDatabaseFallback } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    withDatabaseFallback(
      () =>
        prisma.category.findMany({
          take: 6,
          orderBy: { products: { _count: 'desc' } }
        }),
      [],
      "Home.categories"
    ),
    withDatabaseFallback(
      () =>
        prisma.product.findMany({
          where: { featured: true, isActive: true },
          include: { category: true },
          take: 8,
          orderBy: { createdAt: 'desc' }
        }),
      [],
      "Home.featuredProducts"
    )
  ]);

  // CORREÇÃO AQUI: Adicionamos os campos de parcelamento
  const formattedProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    category: p.category.name,
    images: p.images,
    discountPercent: p.discountPercent,
    isOffer: p.isOffer,
    maxInstallments: p.maxInstallments,   // <--- Importante
    freeInstallments: p.freeInstallments  // <--- Importante
  }));

  return (
    <div className="flex flex-col min-h-screen">

      {/* --- HERO SECTION --- */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/30"></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-400 mb-6 border border-yellow-500/30">
              <Star className="h-3 w-3 fill-current" />
              A Melhor de Osasco
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Design exclusivo, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                conforto absoluto.
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
              Transforme sua casa com móveis de alta qualidade. Entrega rápida e montagem especializada na região de Osasco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ofertas"
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105"
              >
                Ver Ofertas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/sobre"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Conheça a Loja
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- BARRA DE BENEFÍCIOS --- */}
      <section className="bg-yellow-50 border-b border-yellow-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 flex-shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Entrega Própria</h3>
                <p className="text-xs text-gray-600">Exclusivo para Osasco-SP</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 flex-shrink-0">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Parcelamento Flexível</h3>
                <p className="text-xs text-gray-600">Consulte condições sem juros</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Compra Segura</h3>
                <p className="text-xs text-gray-600">Proteção de dados SSL</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 flex-shrink-0">
                <Box className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Qualidade Garantida</h3>
                <p className="text-xs text-gray-600">90 dias de garantia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIAS --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Navegue por Categorias</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="relative h-32 w-32 rounded-full bg-white mb-4 overflow-hidden border-2 border-gray-100 group-hover:border-yellow-500 transition-all shadow-sm p-3">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={`Categoria ${cat.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      quality={100}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold text-xs">
                      {cat.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRODUTOS EM DESTAQUE --- */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Destaques da Semana</h2>
              <p className="text-gray-500 mt-2">Os produtos mais desejados da Sanches Móveis</p>
            </div>
            <Link href="/produto" className="hidden md:flex items-center gap-2 font-bold text-yellow-600 hover:text-yellow-700 hover:underline">
              Ver catálogo completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {formattedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {formattedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-400 mb-4">Nenhum destaque cadastrado ainda.</p>
              <Link href="/admin/produtos" className="text-blue-600 hover:underline">
                Ir para Admin cadastrar
              </Link>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/produto" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-900 shadow-sm">
              Ver todos os produtos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="py-20 bg-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Fique por dentro das novidades</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Cadastre-se para receber ofertas exclusivas e cupons de desconto diretamente no seu e-mail.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Digite seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />
            <button className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
              Inscrever
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
