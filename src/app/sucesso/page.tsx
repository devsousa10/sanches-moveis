import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center">
            <div className="rounded-full bg-green-100 p-6 mb-6">
                <CheckCircle className="h-20 w-20 text-green-600" />
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Pedido Recebido!</h1>
            <p className="text-gray-600 max-w-md">
                Obrigado pela sua compra. O Mercado Pago está processando seu pagamento e você receberá um e-mail em breve.
            </p>

            <div className="mt-8 space-y-4">
                <Link
                    href="/"
                    className="block w-full rounded-full bg-black px-8 py-3 font-bold text-white hover:bg-gray-800 transition-colors"
                >
                    Voltar para a Loja
                </Link>
                <Link
                    href="/admin/pedidos"
                    className="block text-sm text-gray-500 hover:underline"
                >
                    (Dev: Ver pedido no painel)
                </Link>
            </div>
        </main>
    );
}