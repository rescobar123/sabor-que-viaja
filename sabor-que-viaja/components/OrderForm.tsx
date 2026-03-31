"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Minus, Plus } from "lucide-react";
import { type Plan, type EggPrice, type EggSize, EGGS_PER_CARTON, perEggLabel } from "@/lib/plans";

type OrderMode = "subscription" | "one_time";

export default function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMode = (searchParams.get("mode") as OrderMode) ?? "subscription";
  const defaultPlanQty = parseInt(searchParams.get("plan") ?? "30");

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
  const total = mode === "one_time" && currentEggPrice
    ? +(currentEggPrice.price_per_carton * cartons).toFixed(2)
    : 0;

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
          body: JSON.stringify({ user_uuid: userData.uuid, plan_type: String(selectedPlan.eggs_per_week), egg_size: eggSize }),
        });
        const subData = await subRes.json();
        if (!subRes.ok) throw new Error(subData.error);
        orderBody = { ...orderBody, subscription_uuid: subData.uuid, quantity: selectedPlan.eggs_per_week };
      } else {
        orderBody = { ...orderBody, quantity: cartons * EGGS_PER_CARTON };
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const qty = mode === "subscription" ? selectedPlan.eggs_per_week : cartons * EGGS_PER_CARTON;
      router.push(`/confirmacion?name=${encodeURIComponent(name)}&mode=${mode}&qty=${qty}&order=${orderData.uuid}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Tamaño */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-2">Tamaño</p>
        <div className="flex gap-2">
          {(["large", "small"] as EggSize[]).map((key) => {
            const label = key === "large" ? "Grande" : "Pequeño";
            const ep = eggPrices.find((e) => e.egg_size === key);
            const selected = eggSize === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setEggSize(key)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                  selected
                    ? "border-verde-principal bg-verde-principal text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {label}
                {ep && <span className={`block text-xs font-normal mt-0.5 ${selected ? "text-white/70" : "text-gray-400"}`}>Q{ep.price_per_egg.toFixed(2)} c/u</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cantidad */}
      {mode === "one_time" && currentEggPrice && (
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Cartones <span className="font-normal text-gray-400">({EGGS_PER_CARTON} huevos c/u)</span></p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <button
              type="button"
              onClick={() => setCartons((c) => Math.max(1, c - 1))}
              disabled={cartons <= 1}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-verde-principal hover:text-verde-principal disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <div className="text-center">
              <span className="text-3xl font-extrabold text-gray-800">{cartons}</span>
              <p className="text-xs text-gray-400 mt-0.5">Q{total} total</p>
            </div>
            <button
              type="button"
              onClick={() => setCartons((c) => Math.min(10, c + 1))}
              disabled={cartons >= 10}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-verde-principal hover:text-verde-principal disabled:opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Plan suscripción */}
      {mode === "subscription" && (
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Plan semanal</p>
          <div className="flex gap-2">
            {filteredPlans.map((p) => {
              const selected = (selectedPlan?.eggs_per_week ?? planQty) === p.eggs_per_week;
              return (
                <button
                  key={p.uuid}
                  type="button"
                  onClick={() => setPlanQty(p.eggs_per_week)}
                  className={`flex-1 py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    selected
                      ? "border-verde-principal bg-verde-principal text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.eggs_per_week} huevos/sem
                  <span className={`block text-xs font-normal mt-0.5 ${selected ? "text-white/70" : "text-gray-400"}`}>
                    Q{p.price_monthly}/mes · {perEggLabel(p.price_monthly, p.eggs_per_week)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Datos */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Tus datos</p>
        <input
          type="text" required value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
        />
        <input
          type="tel" required value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono / WhatsApp"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
        />
        <textarea
          required rows={2} value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección de entrega"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-verde-cta hover:bg-verde-hover disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2"
      >
        {submitting
          ? <><Loader2 className="w-5 h-5 animate-spin" />Procesando...</>
          : mode === "subscription"
            ? "Confirmar suscripción"
            : `Pedir — Q${total}`}
      </button>

      <p className="text-center text-xs text-gray-400">
        Te contactamos para coordinar la entrega.
      </p>
    </form>
  );
}
