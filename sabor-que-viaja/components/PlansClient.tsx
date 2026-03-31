"use client";

import Link from "next/link";
import { type EggPrice, EGG_SIZE_LABELS, EGGS_PER_CARTON } from "@/lib/plans";

interface Props {
  eggPrices: EggPrice[];
}

export default function PlansClient({ eggPrices }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
      {eggPrices.map((ep) => (
        <div key={ep.egg_size} className="rounded-3xl border-2 border-gray-100 bg-gray-50 p-7 flex flex-col gap-6">
          <h3 className="text-xl font-extrabold text-verde-principal">
            {EGG_SIZE_LABELS[ep.egg_size]}
          </h3>

          {/* Suscripción */}
          <div className="bg-verde-principal rounded-2xl p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">Suscripción semanal</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-extrabold">Q{ep.sub_price_per_carton}</span>
              <span className="text-white/60 text-sm">/cartón · semana</span>
            </div>
            <p className="text-white/60 text-xs">Q{(ep.sub_price_per_carton / EGGS_PER_CARTON).toFixed(2)} por huevo · {EGGS_PER_CARTON} huevos/cartón</p>
            <Link
              href={`/pedido?mode=subscription`}
              className="mt-4 block text-center bg-amarillo hover:bg-yellow-400 text-verde-principal font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Suscribirme
            </Link>
          </div>

          {/* Pedido único */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Pedido único</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-extrabold text-gray-800">Q{ep.price_per_carton}</span>
              <span className="text-gray-400 text-sm">/cartón</span>
            </div>
            <p className="text-gray-400 text-xs">Q{(ep.price_per_carton / EGGS_PER_CARTON).toFixed(2)} por huevo · {EGGS_PER_CARTON} huevos/cartón</p>
            <Link
              href={`/pedido?mode=one_time`}
              className="mt-4 block text-center bg-verde-cta hover:bg-verde-hover text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Hacer pedido
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
