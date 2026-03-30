"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, ShoppingBag, Loader2 } from "lucide-react";
import {
  type Plan, type EggPrice, type EggSize,
  EGG_SIZE_LABELS, perEggLabel, getOneTimeOptions,
} from "@/lib/plans";

type OrderMode = "subscription" | "one_time";

export default function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlanQty = parseInt(searchParams.get("plan") ?? "30");

  const [mode, setMode] = useState<OrderMode>("subscription");
  const [eggSize, setEggSize] = useState<EggSize>("large");
  const [planQty, setPlanQty] = useState(defaultPlanQty);
  const [oneTimeQty, setOneTimeQty] = useState(30);

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
  const oneTimeOptions = currentEggPrice ? getOneTimeOptions(currentEggPrice) : [];
  const selectedOneTime = oneTimeOptions.find((o) => o.quantity === oneTimeQty) ?? oneTimeOptions[0];

  function switchMode(m: OrderMode) {
    setMode(m);
    setError(null);
  }

  function switchSize(s: EggSize) {
    setEggSize(s);
    setOneTimeQty(30);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlan && mode === "subscription") return;
    if (!selectedOneTime && mode === "one_time") return;
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
        orderBody = { ...orderBody, quantity: selectedOneTime.quantity };
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const qty = mode === "subscription" ? selectedPlan.eggs_per_week : selectedOneTime.quantity;
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
        Cargando planes...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">

      {/* Toggle modo */}
      <div className="flex rounded-xl border border-gray-200 p-1 mb-6 bg-gray-50 gap-1">
        {(["subscription", "one_time"] as OrderMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              mode === m ? "bg-verde-principal text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "subscription"
              ? <><RefreshCw className="w-4 h-4" strokeWidth={2} />Suscripción semanal</>
              : <><ShoppingBag className="w-4 h-4" strokeWidth={2} />Pedido único</>}
          </button>
        ))}
      </div>

      {/* Selector de tamaño — compartido */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tamaño</p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(EGG_SIZE_LABELS) as [EggSize, string][]).map(([key, label]) => {
            const ep = eggPrices.find((e) => e.egg_size === key);
            const range = plans.filter((p) => p.egg_size === key);
            const min = range.length ? Math.min(...range.map((p) => p.price_monthly)) : null;
            const max = range.length ? Math.max(...range.map((p) => p.price_monthly)) : null;
            return (
              <button
                key={key}
                type="button"
                onClick={() => switchSize(key)}
                className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  eggSize === key ? "border-verde-principal bg-verde-principal/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`text-sm font-bold ${eggSize === key ? "text-verde-principal" : "text-gray-600"}`}>
                  {label}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">
                  {mode === "subscription" && min !== null
                    ? `Q${min}–Q${max}/mes`
                    : ep ? `Q${ep.price_per_egg.toFixed(2)}/huevo` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SUSCRIPCIÓN ── */}
      {mode === "subscription" && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {filteredPlans.map((p) => (
              <button
                key={p.uuid}
                type="button"
                onClick={() => setPlanQty(p.eggs_per_week)}
                className={`flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                  planQty === p.eggs_per_week ? "border-verde-principal bg-verde-principal/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wide mb-1 ${planQty === p.eggs_per_week ? "text-verde-cta" : "text-gray-400"}`}>
                  {p.name}
                </span>
                <span className="font-extrabold text-verde-principal text-lg leading-none">{p.eggs_per_week} huevos</span>
                <span className="text-gray-400 text-xs mt-0.5">por semana</span>
                <span className={`mt-2 text-sm font-bold ${planQty === p.eggs_per_week ? "text-verde-principal" : "text-gray-600"}`}>
                  Q{p.price_monthly}<span className="font-normal text-gray-400">/mes</span>
                </span>
                <span className="text-xs text-gray-400">{perEggLabel(p.price_monthly, p.eggs_per_week)} c/u</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-6">
            Entrega semanal. Puedes pausar o cancelar cuando quieras.
          </p>
        </>
      )}

      {/* ── PEDIDO ÚNICO ── */}
      {mode === "one_time" && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {oneTimeOptions.map((opt) => (
              <button
                key={opt.quantity}
                type="button"
                onClick={() => setOneTimeQty(opt.quantity)}
                className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  oneTimeQty === opt.quantity ? "border-verde-principal bg-verde-principal/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`text-sm font-bold ${oneTimeQty === opt.quantity ? "text-verde-principal" : "text-gray-600"}`}>
                  {opt.label}
                </span>
                <span className="text-xs text-gray-400">{opt.sublabel}</span>
                <span className={`mt-1.5 text-base font-extrabold ${oneTimeQty === opt.quantity ? "text-verde-principal" : "text-gray-700"}`}>
                  Q{opt.price}
                </span>
                <span className="text-xs text-gray-400">{opt.unit_label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-6">
            Un solo pedido, sin compromiso. Coordinaremos la entrega contigo.
          </p>
        </>
      )}

      {/* Formulario de contacto */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre completo *</label>
          <input
            id="name" type="text" required value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan García"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-cta focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono / WhatsApp *</label>
          <input
            id="phone" type="tel" required value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="5555-1234"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-cta focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">Dirección de entrega *</label>
          <textarea
            id="address" required rows={3} value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Zona 10, Ciudad de Guatemala..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-cta focus:border-transparent transition resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-verde-cta hover:bg-verde-hover disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
        >
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />Procesando...</>
          ) : mode === "subscription" ? (
            "Confirmar suscripción"
          ) : selectedOneTime ? (
            `Confirmar pedido — Q${selectedOneTime.price}`
          ) : (
            "Confirmar pedido"
          )}
        </button>

        <p className="text-center text-xs text-gray-400">
          Te contactaremos para coordinar la entrega. Sin compromisos a largo plazo.
        </p>
      </form>
    </div>
  );
}
