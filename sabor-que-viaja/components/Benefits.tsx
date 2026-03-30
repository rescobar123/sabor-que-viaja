import { BadgeCheck, Tractor, BadgeDollarSign, Recycle, Heart, Zap } from "lucide-react";

const benefits = [
  {
    Icon: BadgeCheck,
    title: "Frescos de verdad",
    description: "Recolectados en las últimas 24-48 horas antes de llegar a tu mesa.",
    style: "border-green-200 bg-green-50 text-verde-principal",
  },
  {
    Icon: Tractor,
    title: "Directo del campo",
    description: "Sin bodegas ni supermercados. Del productor directo a tu mesa.",
    style: "border-yellow-200 bg-yellow-50 text-tierra",
  },
  {
    Icon: BadgeDollarSign,
    title: "Sin intermediarios",
    description: "Precio justo para el productor y mejor precio para ti. Todos ganamos.",
    style: "border-sky-200 bg-sky-50 text-azul",
  },
  {
    Icon: Recycle,
    title: "Sostenible",
    description: "Menos empaque, menos transporte, menos huella. Mejor para el planeta.",
    style: "border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  {
    Icon: Heart,
    title: "Con propósito",
    description: "Cada compra apoya a familias rurales guatemaltecas y sus tradiciones.",
    style: "border-rose-200 bg-rose-50 text-rose-500",
  },
  {
    Icon: Zap,
    title: "Sin complicaciones",
    description: "Suscríbete en 2 minutos. Pausa o cancela cuando lo necesites.",
    style: "border-purple-200 bg-purple-50 text-purple-500",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-verde-cta font-semibold text-xs sm:text-sm uppercase tracking-widest">
            Por qué elegirnos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-verde-principal mt-2">
            Más que huevos
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Es una forma de comer mejor, apoyar lo local y simplificar tu vida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {benefits.map(({ Icon, title, description, style }) => (
            <div
              key={title}
              className={`rounded-2xl border p-5 sm:p-6 flex gap-4 hover:shadow-md transition-shadow duration-200 ${style.split(" ").slice(0, 2).join(" ")}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/70 ${style.split(" ")[2]}`}>
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold text-verde-principal text-sm sm:text-base mb-1">
                  {title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
