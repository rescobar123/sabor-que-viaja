import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Hacer pedido — Sabor que viaja",
  description: "Suscríbete y recibe huevos frescos cada semana directo en tu puerta.",
};

export default function PedidoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-verde-principal py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          <div className="text-5xl mb-4">🥚</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Inicia tu suscripción
          </h1>
          <p className="text-white/80">
            Completa el formulario y nos comunicamos contigo para coordinar tu
            primera entrega.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <Suspense fallback={<div className="text-center py-8 text-gray-500">Cargando...</div>}>
            <OrderForm />
          </Suspense>
        </div>

        {/* Garantías */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "🔒", label: "Datos seguros" },
            { icon: "✅", label: "Sin contratos" },
            { icon: "💬", label: "Soporte directo" },
          ].map((item) => (
            <div key={item.label} className="text-sm text-gray-500">
              <div className="text-2xl mb-1">{item.icon}</div>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
