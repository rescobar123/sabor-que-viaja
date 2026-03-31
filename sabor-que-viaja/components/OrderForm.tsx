"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Minus, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { type EggPrice, type EggSize, EGGS_PER_CARTON } from "@/lib/plans";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

type OrderMode = "subscription" | "one_time";

export default function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMode = (searchParams.get("mode") as OrderMode) ?? "subscription";

  const [mode] = useState<OrderMode>(defaultMode);
  const [eggSize, setEggSize] = useState<EggSize>("large");
  const [cartons, setCartons] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [eggPrices, setEggPrices] = useState<EggPrice[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch("/api/plans")
      .then((r) => r.json())
      .then(({ eggPrices }) => setEggPrices(eggPrices ?? []))
      .finally(() => setLoadingData(false));
  }, []);

  const ep = eggPrices.find((e) => e.egg_size === eggSize);
  const pricePerCarton = mode === "subscription"
    ? ep?.sub_price_per_carton ?? 0
    : ep?.price_per_carton ?? 0;
  const weeklyPrice = +(pricePerCarton * cartons).toFixed(2);
  const monthlyPrice = +(pricePerCarton * cartons * 4).toFixed(2);
  const totalEggs = cartons * EGGS_PER_CARTON;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ep) return;
    if (!address) { setError("Selecciona tu ubicación en el mapa."); return; }
    setSubmitting(true);
    setError(null);

    try {
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone,
          address: instructions ? `${address}\nInstrucciones: ${instructions}` : address,
        }),
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
        quantity: totalEggs,
      };

      if (mode === "subscription") {
        const subRes = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_uuid: userData.uuid, egg_size: eggSize, cartons_per_week: cartons }),
        });
        const subData = await subRes.json();
        if (!subRes.ok) throw new Error(subData.error);
        orderBody = { ...orderBody, subscription_uuid: subData.uuid };
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      router.push(`/confirmacion?name=${encodeURIComponent(name)}&mode=${mode}&qty=${totalEggs}&order=${orderData.uuid}`);
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
            const price = eggPrices.find((e) => e.egg_size === key);
            const selected = eggSize === key;
            return (
              <button key={key} type="button" onClick={() => setEggSize(key)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                  selected ? "border-verde-principal bg-verde-principal text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {key === "large" ? "Grande" : "Pequeño"}
                {price && (
                  <span className={`block text-xs font-normal mt-0.5 ${selected ? "text-white/70" : "text-gray-400"}`}>
                    Q{((mode === "subscription" ? price.sub_price_per_carton : price.price_per_carton) / EGGS_PER_CARTON).toFixed(2)} c/u
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cartones — igual para suscripción y pedido único */}
      {ep && (
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Cartones por {mode === "subscription" ? "semana" : "pedido"}
            <span className="font-normal text-gray-400"> ({EGGS_PER_CARTON} huevos c/u)</span>
          </p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <button type="button" onClick={() => setCartons((c) => Math.max(1, c - 1))} disabled={cartons <= 1}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-verde-principal hover:text-verde-principal disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div className="text-center">
              <span className="text-3xl font-extrabold text-gray-800">{cartons}</span>
              <p className="text-xs text-gray-400 mt-0.5">{totalEggs} huevos</p>
            </div>

            <button type="button" onClick={() => setCartons((c) => Math.min(10, c + 1))} disabled={cartons >= 10}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-verde-principal hover:text-verde-principal disabled:opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-400 px-1">
            {mode === "subscription" ? (
              <>
                <span>Q{weeklyPrice}/semana</span>
                <span className="font-semibold text-verde-principal">Q{monthlyPrice}/mes</span>
              </>
            ) : (
              <span className="font-semibold text-verde-principal ml-auto">Q{weeklyPrice} total</span>
            )}
          </div>
        </div>
      )}

      {/* Datos */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Tus datos</p>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
        />
        <input type="tel" required value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
          placeholder="Teléfono / WhatsApp (8 dígitos)"
          inputMode="numeric" pattern="\d{8}"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
        />
      </div>

      {/* Ubicación */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-2">Dirección de entrega</p>
        <MapPicker onAddressChange={setAddress} />
        <input type="text" value={instructions} onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instrucciones (opcional) — portón azul, apto 3B..."
          className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <button type="submit" disabled={submitting}
        className="w-full bg-verde-cta hover:bg-verde-hover disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2"
      >
        {submitting
          ? <><Loader2 className="w-5 h-5 animate-spin" />Procesando...</>
          : mode === "subscription"
            ? `Suscribirme — Q${monthlyPrice}/mes`
            : `Pedir — Q${weeklyPrice}`}
      </button>

      <p className="text-center text-xs text-gray-400">
        Te contactamos para coordinar la entrega.
      </p>
    </form>
  );
}
