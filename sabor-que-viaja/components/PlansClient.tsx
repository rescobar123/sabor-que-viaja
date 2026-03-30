"use client";

import { useState } from "react";
import Link from "next/link";
import { type Plan, type EggSize, EGG_SIZE_LABELS, perEggLabel } from "@/lib/plans";

const FEATURES: Record<number, string[]> = {
  30: [
    "30 huevos frescos por semana",
    "Entrega semanal a domicilio",
    "Huevos de gallina criolla",
    "Sin compromiso de permanencia",
    "Soporte por WhatsApp",
  ],
  60: [
    "60 huevos frescos por semana",
    "Entrega semanal a domicilio",
    "Huevos de gallina criolla",
    "Sin compromiso de permanencia",
    "Soporte por WhatsApp",
    "Precio preferencial por volumen",
  ],
};

interface Props {
  plans: Plan[];
}

export default function PlansClient({ plans }: Props) {
  const [size, setSize] = useState<EggSize>("large");

  const filtered = plans.filter((p) => p.egg_size === size);

  return (
    <>
      {/* Toggle tamaño */}
      <div className="flex justify-center mt-6 mb-10 sm:mb-12">
        <div className="inline-flex rounded-xl border border-gray-200 p-1 bg-gray-50 gap-1">
          {(Object.entries(EGG_SIZE_LABELS) as [EggSize, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSize(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                size === key ? "bg-verde-principal text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {filtered.map((plan) => {
          const featured = plan.eggs_per_week === 60;
          return (
            <div
              key={plan.uuid}
              className={`relative rounded-3xl p-7 flex flex-col ${
                featured
                  ? "bg-verde-principal text-white shadow-2xl shadow-verde-principal/25 md:scale-105"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
            >
              {featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amarillo text-verde-principal font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wide">
                  Más popular
                </span>
              )}

              <div className="mb-5">
                <h3 className={`font-extrabold text-xl mb-0.5 ${featured ? "text-white" : "text-verde-principal"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${featured ? "text-white/70" : "text-gray-500"}`}>
                  {EGG_SIZE_LABELS[plan.egg_size]} · {plan.eggs_per_week} huevos/semana
                </p>
              </div>

              <div className="mb-7">
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-extrabold ${featured ? "text-amarillo" : "text-verde-principal"}`}>
                    Q{plan.price_monthly}
                  </span>
                  <span className={`text-base ${featured ? "text-white/60" : "text-gray-400"}`}>/mes</span>
                </div>
                <p className={`text-sm mt-1 ${featured ? "text-white/50" : "text-gray-400"}`}>
                  {perEggLabel(plan.price_monthly, plan.eggs_per_week)} por huevo
                </p>
              </div>

              <ul className="flex-1 space-y-2.5 mb-7">
                {(FEATURES[plan.eggs_per_week] ?? []).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 flex-shrink-0 ${featured ? "text-amarillo" : "text-verde-cta"}`}>✓</span>
                    <span className={featured ? "text-white/85" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/pedido?plan=${plan.eggs_per_week}`}
                className={`block text-center font-bold py-3.5 px-6 rounded-full transition-all duration-200 ${
                  featured
                    ? "bg-amarillo text-verde-principal hover:bg-yellow-400"
                    : "bg-verde-cta text-white hover:bg-verde-hover"
                }`}
              >
                Elegir este plan
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
