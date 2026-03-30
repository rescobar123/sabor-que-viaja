import { LayoutList, MapPin, PackageCheck } from "lucide-react";

const steps = [
  {
    Icon: LayoutList,
    title: "Elige tu plan",
    description:
      "Selecciona cuántos huevos necesitas por semana. Tenemos el plan perfecto para ti.",
  },
  {
    Icon: MapPin,
    title: "Dinos dónde estás",
    description:
      "Ingresa tu dirección y teléfono. Nosotros coordinamos la entrega contigo.",
  },
  {
    Icon: PackageCheck,
    title: "Recibe en casa",
    description:
      "Cada semana tus huevos frescos llegan a tu puerta, recolectados el mismo día.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-verde-cta font-semibold text-xs sm:text-sm uppercase tracking-widest">
            Simple y rápido
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-verde-principal mt-2">
            Cómo funciona
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            En 3 pasos tienes huevos frescos llegando a tu puerta cada semana.
          </p>
        </div>

        {/* Mobile: lista vertical con línea lateral */}
        <div className="flex flex-col sm:hidden gap-0">
          {steps.map(({ Icon, title, description }, index) => (
            <div key={title} className="flex gap-4">
              {/* Línea + número */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-verde-principal text-white font-extrabold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-verde-principal/20 my-1" />
                )}
              </div>
              {/* Contenido */}
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-5 h-5 text-verde-cta" strokeWidth={1.75} />
                  <h3 className="font-bold text-verde-principal text-base">{title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: grid con línea conectora */}
        <div className="hidden sm:grid grid-cols-3 gap-8 relative">
          <div className="absolute top-[52px] left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-verde-principal/15" />

          {steps.map(({ Icon, title, description }, index) => (
            <div key={title} className="text-center relative">
              <div className="relative inline-flex flex-col items-center justify-center w-[104px] h-[104px] rounded-2xl bg-verde-principal text-white mb-5 shadow-md mx-auto">
                <Icon className="w-9 h-9" strokeWidth={1.5} />
                <span className="absolute -top-2.5 -right-2.5 bg-amarillo text-verde-principal text-xs font-extrabold w-7 h-7 rounded-full flex items-center justify-center shadow">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-bold text-verde-principal text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] mx-auto">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
