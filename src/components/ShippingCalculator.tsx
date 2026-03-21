"use client";

import { useState } from "react";
import { Truck, AlertCircle, CheckCircle } from "lucide-react";

export function ShippingCalculator() {
    const [cep, setCep] = useState("");
    const [result, setResult] = useState<{ message: string; success: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cep.length < 8) return;

        setLoading(true);
        setResult(null);

        try {
            // Consulta real ao ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setResult({ message: "CEP não encontrado.", success: false });
            } else if (data.localidade === "Osasco") {
                setResult({
                    message: "Frete Grátis - Chega em até 2 dias úteis",
                    success: true
                });
            } else {
                setResult({
                    message: `Desculpe, no momento só entregamos em Osasco-SP. (Seu CEP é de ${data.localidade})`,
                    success: false
                });
            }
        } catch (error) {
            setResult({ message: "Erro ao consultar CEP.", success: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mt-6">
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm uppercase tracking-wide">
                <Truck className="h-4 w-4" /> Consultar Entrega
            </div>

            <form onSubmit={handleCalculate} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Digite seu CEP"
                    maxLength={9}
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                />
                <button
                    type="submit"
                    disabled={loading || cep.length < 8}
                    className="bg-black text-white px-5 rounded text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {loading ? "..." : "OK"}
                </button>
            </form>

            {result && (
                <div className={`mt-4 text-sm p-3 rounded flex items-start gap-2 ${result.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
                    }`}>
                    {result.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                    <span className="font-medium">{result.message}</span>
                </div>
            )}

            <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" className="text-[10px] text-gray-400 underline mt-2 block hover:text-gray-600">
                Não sei meu CEP
            </a>
        </div>
    );
}