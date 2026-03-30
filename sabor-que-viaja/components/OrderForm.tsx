"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, User, Phone, MapPin, Check } from "lucide-react";
import {
  type Plan, type EggPrice, type EggSize,
  EGG_SIZE_LABELS, perEggLabel, getOneTimeOptions,
} from "@/lib/plans";

type OrderMode = "subscription" | "one_time";

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-5 h-5 rounded-full bg-verde-principal text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </span>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlanQty = parseInt(searchParams.get("plan") ?? "30");
  const defaultMode = (searchParams.get("mode") as OrderMode) ?? "subscription";

  const [mode, setMode] = useState<OrderMode>(defaultMode);
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

  const summaryLabel = mode === "subscription" && selectedPlan
    ? `${selectedPlan.eggs_per_week} huevos / semana — Q${selectedPlan.price_monthly}/mes`
    : selectedOneTime
    ? `${selectedOneTime.label} (${selectedOneTime.sublabel}) — Q${selectedOneTime.price}`
    : null;

  return (
    <div className="max-w-lg mx-auto space-y-7">

      {/* Paso 1 — Selección */}
      <div>
        <StepLabel number={1} label="Tu pedido" />

        {/* Tamaño */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(Object.entries(EGG_SIZE_LABELS) as [EggSize, string][]).map(([key, label]) => {
            const ep = eggPrices.find((e) => e.egg_size === key);
            const range = plans.filter((p) => p.egg_size === key);
            const min = range.length ? Math.min(...range.map((p) => p.price_monthly)) : null;
            const max = range.length ? Math.max(...range.map((p) => p.price_monthly)) : null;
            const selected = eggSize === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => switchSize(key)}
                className={`relative flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  selected
                    ? "border-verde-principal bg-verde-principal/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {selected && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-verde-principal rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </span>
                )}
                <span className={`text-sm font-bold ${selected ? "text-verde-principal" : "text-gray-700"}`}>
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

        {/* Planes de suscripción */}
        {mode === "subscription" && (
          <div className="grid grid-cols-2 gap-2">
            {filteredPlans.map((p) => {
              const selected = planQty === p.eggs_per_week;
              return (
                <button
                  key={p.uuid}
                  type="button"
                  onClick={() => setPlanQty(p.eggs_per_week)}
                  className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    selected
                      ? "border-verde-principal bg-verde-principal/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-verde-principal rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <span className={`text-xs font-semibold uppercase tracking-wide mb-1 ${selected ? "text-verde-cta" : "text-gray-400"}`}>
                    {p.name}
                  </span>
                  <span className="font-extrabold text-gray-800 text-lg leading-none">{p.eggs_per_week} huevos</span>
                  <span className="text-gray-400 text-xs mt-0.5">por semana</span>
                  <span className={`mt-2.5 text-sm font-bold ${selected ? "text-verde-principal" : "text-gray-600"}`}>
                    Q{p.price_monthly}<span className="font-normal text-gray-400">/mes</span>
                  </span>
                  <span className="text-xs text-gray-400">{perEggLabel(p.price_monthly, p.eggs_per_week)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Pedido único */}
        {mode === "one_time" && (
          <div className="grid grid-cols-2 gap-2">
            {oneTimeOptions.map((opt) => {
              const selected = oneTimeQty === opt.quantity;
              return (
                <button
                  key={opt.quantity}
                  type="button"
                  onClick={() => setOneTimeQty(opt.quantity)}
                  className={`relative flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                    selected
                      ? "border-verde-principal bg-verde-principal/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-verde-principal rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <span className={`text-sm font-bold ${selected ? "text-verde-principal" : "text-gray-700"}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-gray-400">{opt.sublabel}</span>
                  <span className={`mt-2 text-base font-extrabold ${selected ? "text-verde-principal" : "text-gray-800"}`}>
                    Q{opt.price}
                  </span>
                  <span className="text-xs text-gray-400">{opt.unit_label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Paso 2 — Tus datos */}
      <form onSubmit={handleSubmit}>
        <StepLabel number={2} label="Tus datos" />
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel" required value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono / WhatsApp"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <textarea
              required rows={2} value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección de entrega"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition resize-none"
            />
          </div>
        </div>

        {/* Resumen */}
        {summaryLabel && (
          <div className="mt-4 flex items-center gap-3 bg-verde-principal/5 border border-verde-principal/20 rounded-xl px-4 py-3">
            <Check className="w-4 h-4 text-verde-principal flex-shrink-0" strokeWidth={2.5} />
            <span className="text-sm text-verde-principal font-medium">{summaryLabel}</span>
          </div>
        )}

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
          ) : selectedOneTime ? (
            `Confirmar pedido — Q${selectedOneTime.price}`
          ) : (
            "Confirmar pedido"
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Te contactamos para coordinar la entrega. Sin compromisos a largo plazo.
        </p>
      </form>
    </div>
  );
}
