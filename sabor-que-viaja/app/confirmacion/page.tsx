import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";

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
  const orderUuid = searchParams.order ?? "";

  const isSubscription = mode === "subscription";

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50212345678";
  const waMessage = `Hola! Acabo de hacer un pedido. Mi número de orden es: ${orderUuid}`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-verde-principal/10 rounded-full mb-5">
            <CheckCircle2 className="w-10 h-10 text-verde-principal" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-verde-principal mb-2">
            ¡Listo, {name.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {isSubscription
              ? "Tu suscripción fue registrada. Te contactamos pronto para coordinar la primera entrega."
              : "Tu pedido fue registrado. Te contactamos para coordinar la entrega."}
          </p>
        </div>

        {/* Detalle del pedido */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Tipo</span>
            <span className="text-sm font-semibold text-verde-principal">
              {isSubscription ? "Suscripción semanal" : "Pedido único"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Producto</span>
            <span className="text-sm font-semibold text-gray-700">
              {qty} huevos{isSubscription ? " / semana" : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Estado</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-verde-cta">
              <span className="w-2 h-2 bg-verde-cta rounded-full" />
              Pendiente de confirmación
            </span>
          </div>
          {orderUuid && (
            <div className="flex justify-between items-start pt-1 border-t border-gray-100">
              <span className="text-sm text-gray-400">N° de orden</span>
              <span className="text-xs font-mono text-gray-400 text-right max-w-[180px] break-all">
                {orderUuid}
              </span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a84f] text-white font-bold py-4 px-6 rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
            Confirmar por WhatsApp
          </a>
          <Link
            href="/"
            className="text-center border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
