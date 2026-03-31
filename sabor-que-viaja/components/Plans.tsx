import db from "@/lib/db";
import type { EggPrice } from "@/lib/plans";
import PlansClient from "@/components/PlansClient";

export default async function Plans() {
  const raw = await db("egg_prices").select("*");
  const eggPrices: EggPrice[] = raw.map((ep: any) => ({
    ...ep,
    price_per_carton: Number(ep.price_per_carton),
    sub_price_per_carton: Number(ep.sub_price_per_carton),
  }));

  return (
    <section id="planes" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-verde-cta font-semibold text-xs sm:text-sm uppercase tracking-widest">
            Precios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-verde-principal mt-2">
            Simple y transparente
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Suscripción semanal o pedido único. Tú decides.
          </p>
        </div>
        <PlansClient eggPrices={eggPrices} />
      </div>
    </section>
  );
}
