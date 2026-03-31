import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pedido confirmado — Sabor que viaja",
  description: "Tu pedido ha sido registrado exitosamente.",
};

interface Props {
  searchParams: { name?: string; mode?: string; qty?: string; order?: string };
}

export default function ConfirmacionPage({ searchParams }: Props) {
  const name = searchParams.name ?? "Cliente";
  const mode = searchParams.mode ?? "subscription";
  const qty = searchParams.qty ?? "30";
  const isSubscription = mode === "subscription";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-verde-principal/10 rounded-full mb-5">
          <CheckCircle2 className="w-8 h-8 text-verde-principal" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          ¡Listo, {name.split(" ")[0]}!
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          {isSubscription
            ? `Tu suscripción de ${qty} huevos por semana fue registrada.`
            : `Tu pedido de ${qty} huevos fue registrado.`}
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Nos comunicaremos contigo pronto para coordinar la entrega.
        </p>

        <Link
          href="/"
          className="inline-block border border-gray-200 text-gray-500 hover:bg-gray-100 font-semibold py-3 px-8 rounded-xl transition-colors text-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
