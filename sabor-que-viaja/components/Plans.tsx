import db from "@/lib/db";
import type { Plan } from "@/lib/plans";
import PlansClient from "@/components/PlansClient";

export default async function Plans() {
  const plans: Plan[] = await db("plans")
    .where({ active: true })
    .orderBy([
      { column: "eggs_per_week", order: "asc" },
      { column: "egg_size", order: "asc" },
    ]);

  return (
    <section id="planes" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-verde-cta font-semibold text-xs sm:text-sm uppercase tracking-widest">
            Suscripciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-verde-principal mt-2">
            Elige tu plan
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Precios justos, huevos reales. Cancela cuando quieras.
          </p>
        </div>

        <PlansClient plans={plans} />
      </div>
    </section>
  );
}
