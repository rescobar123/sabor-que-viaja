"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, User, Phone, MapPin, Check, Minus, Plus } from "lucide-react";
import {
  type Plan, type EggPrice, type EggSize,
  EGG_SIZE_LABELS, perEggLabel, EGGS_PER_CARTON,
} from "@/lib/plans";

type OrderMode = "subscription" | "one_time";

export default function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlanQty = parseInt(searchParams.get("plan") ?? "30");
  const defaultMode = (searchParams.get("mode") as OrderMode) ?? "subscription";

  const [mode] = useState<OrderMode>(defaultMode);
  const [eggSize, setEggSize] = useState<EggSize>("large");
  const [planQty, setPlanQty] = useState(defaultPlanQty);
  const [cartons, setCartons] = useState(1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [eggPrices, setEggPrices] = useState<EggPrice[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then(({ plans, eggPrices }) => {
        setPlans(plans ?? []);
        setEggPrices(eggPrices ?? []);
      })
      .finally(() => setLoadingData(false));
  }, []);

  const filteredPlans = plans.filter((p) => p.egg_size === eggSize);
  const selectedPlan = filteredPlans.find((p) => p.eggs_per_week === planQty) ?? filteredPlans[0];
  const currentEggPrice = eggPrices.find((ep) => ep.egg_size === eggSize);

  const totalOneTime = currentEggPrice
    ? +(currentEggPrice.price_per_carton * cartons).toFixed(2)
    : 0;
  const totalEggs = cartons * EGGS_PER_CARTON;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "subscription" && !selectedPlan) return;
    if (mode === "one_time" && !currentEggPrice) return;
    setSubmitting(true);
    setError(null);

    try {
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
      const userData = await userRes.json();
      if (!userRes.ok) throw new Error(userData.error);

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      const delivery_date = deliveryDate.toISOString().split("T")[0];

      let orderBody: Record<string, unknown> = {
        user_uuid: userData.uuid,
        delivery_date,
        product: eggSize === "small" ? "huevos_pequeño" : "huevos_grande",
      };

      if (mode === "subscription") {
        const subRes = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_uuid: userData.uuid,
            plan_type: String(selectedPlan.eggs_per_week),
            egg_size: eggSize,
          }),
        });
        const subData = await subRes.json();
        if (!subRes.ok) throw new Error(subData.error);
        orderBody = { ...orderBody, subscription_uuid: subData.uuid, quantity: selectedPlan.eggs_per_week };
      } else {
        orderBody = { ...orderBody, quantity: totalEggs };
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const qty = mode === "subscription" ? selectedPlan.eggs_per_week : totalEggs;
      router.push(`/confirmacion?name=${encodeURIComponent(name)}&mode=${mode}&qty=${qty}&order=${orderData.uuid}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">

      {/* Paso 1 — Tamaño */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          1 · Tamaño de huevo
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(EGG_SIZE_LABELS) as [EggSize, string][]).map(([key, label]) => {
            const ep = eggPrices.find((e) => e.egg_size === key);
            const selected = eggSize === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { setEggSize(key); setError(null); }}
                className={`relative flex flex-col items-start px-5 py-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                  selected
                    ? "border-verde-principal bg-verde-principal/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {selected && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-verde-principal rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
                <span className={`text-base font-bold mb-0.5 ${selected ? "text-verde-principal" : "text-gray-800"}`}>
                  {label}
                </span>
                {ep && (
                  <span className="text-xs text-gray-400">
                    Q{ep.price_per_egg.toFixed(2)} c/u
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Paso 2 — Cantidad / Plan */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          {mode === "subscription" ? "2 · Plan semanal" : "2 · Cantidad"}
        </p>

        {/* Suscripción — tarjetas de plan */}
        {mode === "subscription" && (
          <div className="grid grid-cols-2 gap-3">
            {filteredPlans.map((p) => {
              const selected = (selectedPlan?.eggs_per_week ?? planQty) === p.eggs_per_week;
              return (
                <button
                  key={p.uuid}
                  type="button"
                  onClick={() => setPlanQty(p.eggs_per_week)}
                  className={`relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-150 ${
                    selected
                      ? "border-verde-principal bg-verde-principal/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  {selected && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-verde-principal rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <span className={`text-xs font-semibold uppercase tracking-wide mb-2 ${selected ? "text-verde-cta" : "text-gray-400"}`}>
                    {p.name}
                  </span>
                  <span className="text-2xl font-extrabold text-gray-800 leading-none">
                    {p.eggs_per_week}
                    <span className="text-sm font-normal text-gray-400 ml-1">huevos/sem</span>
                  </span>
                  <div className={`mt-3 pt-3 border-t w-full ${selected ? "border-verde-principal/20" : "border-gray-100"}`}>
                    <span className={`text-lg font-bold ${selected ? "text-verde-principal" : "text-gray-700"}`}>
                      Q{p.price_monthly}
                      <span className="text-xs font-normal text-gray-400">/mes</span>
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">{perEggLabel(p.price_monthly, p.eggs_per_week)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Pedido único — stepper de cartones */}
        {mode === "one_time" && currentEggPrice && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Cartones</p>
                <p className="text-xs text-gray-400">{EGGS_PER_CARTON} huevos por cartón</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCartons((c) => Math.max(1, c - 1))}
                  className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-verde-principal hover:text-verde-principal transition-colors disabled:opacity-30"
                  disabled={cartons <= 1}
                >
                  <Minus className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <span className="text-2xl font-extrabold text-gray-800 w-6 text-center">{cartons}</span>
                <button
                  type="button"
                  onClick={() => setCartons((c) => Math.min(10, c + 1))}
                  className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-verde-principal hover:text-verde-principal transition-colors disabled:opacity-30"
                  disabled={cartons >= 10}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400">{totalEggs} huevos en total</p>
                <p className="text-xs text-gray-400">Q{currentEggPrice.price_per_egg.toFixed(2)} c/u</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-verde-principal">Q{totalOneTime}</p>
                <p className="text-xs text-gray-400">total</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Paso 3 — Datos de contacto */}
      <form onSubmit={handleSubmit}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          3 · Tus datos
        </p>
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="tel" required value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono / WhatsApp"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <textarea
              required rows={2} value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección de entrega"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition resize-none"
            />
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Tu pedido</p>
            {mode === "subscription" && selectedPlan ? (
              <p className="text-sm font-semibold text-gray-700">
                {selectedPlan.eggs_per_week} huevos/sem · {EGG_SIZE_LABELS[eggSize]}
              </p>
            ) : (
              <p className="text-sm font-semibold text-gray-700">
                {cartons} {cartons === 1 ? "cartón" : "cartones"} · {EGG_SIZE_LABELS[eggSize]}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">
              {mode === "subscription" ? "mensual" : "total"}
            </p>
            <p className="text-base font-extrabold text-verde-principal">
              {mode === "subscription" && selectedPlan
                ? `Q${selectedPlan.price_monthly}`
                : `Q${totalOneTime}`}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full bg-verde-cta hover:bg-verde-hover disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl text-base transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />Procesando...</>
          ) : mode === "subscription" ? (
            "Confirmar suscripción"
          ) : (
            `Confirmar pedido — Q${totalOneTime}`
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Te contactamos para coordinar la entrega.
        </p>
      </form>
    </div>
  );
}
