import { Sprout, Leaf, Truck, HandHeart } from "lucide-react";

const items = [
  {
    Icon: Sprout,
    title: "Gallinas criollas",
    description:
      "Criadas en libertad, sin jaulas, alimentadas de forma natural en granjas del interior de Guatemala.",
    color: "text-verde-principal bg-green-50",
  },
  {
    Icon: Leaf,
    title: "100% naturales",
    description:
      "Sin hormonas artificiales ni antibióticos. Solo lo que la naturaleza ofrece.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    Icon: Truck,
    title: "Entrega a domicilio",
    description:
      "Recibe tus huevos frescos cada semana directo en tu puerta, sin salir de casa.",
    color: "text-azul bg-sky-50",
  },
  {
    Icon: HandHeart,
    title: "Apoyo local",
    description:
      "Cada compra apoya directamente a familias agricultoras guatemaltecas.",
    color: "text-tierra bg-orange-50",
  },
];

export default function WhatWeOffer() {
  return (
    <section id="que-ofrecemos" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-verde-cta font-semibold text-xs sm:text-sm uppercase tracking-widest">
            Lo que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-verde-principal mt-2">
            Calidad que se siente
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            No son huevos de supermercado. Son huevos reales, con sabor real,
            traídos directamente desde el campo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ Icon, title, description, color }) => (
            <div
              key={title}
              className="flex flex-col p-6 rounded-2xl border border-gray-100 hover:border-verde-cta/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${color} group-hover:scale-105 transition-transform duration-200`}>
                <Icon className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-verde-principal text-base mb-1.5">
                {title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
