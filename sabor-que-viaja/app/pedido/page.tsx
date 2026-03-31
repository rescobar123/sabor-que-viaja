import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Hacer pedido — Sabor que viaja",
  description: "Huevos frescos directo a tu puerta.",
};

interface Props {
  searchParams: { mode?: string; plan?: string };
}

export default function PedidoPage({ searchParams }: Props) {
  const isSubscription = searchParams.mode !== "one_time";

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-6 pb-2 max-w-lg mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
      </div>

      {/* Contenido */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          {isSubscription ? "Suscripción semanal" : "Hacer un pedido"}
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          {isSubscription
            ? "Recibe huevos frescos cada semana. Cancela cuando quieras."
            : "Sin compromisos. Te coordinamos la entrega."}
        </p>

        <Suspense fallback={<div className="text-center py-8 text-gray-400">Cargando...</div>}>
          <OrderForm />
        </Suspense>
      </div>
    </main>
  );
}
