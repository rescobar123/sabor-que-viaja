import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const products = [
  {
    available: true,
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <ellipse cx="32" cy="36" rx="18" ry="22" fill="#F4C542" />
        <ellipse cx="32" cy="34" rx="16" ry="19" fill="#F9D85A" />
        <ellipse cx="26" cy="28" rx="4" ry="6" fill="white" opacity="0.25" />
      </svg>
    ),
    name: "Huevos de granja",
    description: "Gallinas criollas, criadas en libertad. Recolectados frescos cada semana.",
    badge: "Disponible ahora",
    badgeStyle: "bg-verde-cta/10 text-verde-cta border border-verde-cta/20",
    cta: { label: "Ver planes", href: "#planes" },
  },
  {
    available: false,
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <rect x="16" y="20" width="32" height="30" rx="4" fill="#E2EEF7" />
        <rect x="20" y="14" width="24" height="10" rx="3" fill="#C8DFF0" />
        <rect x="26" y="10" width="12" height="6" rx="2" fill="#B5D0E8" />
        <rect x="22" y="34" width="20" height="3" rx="1.5" fill="white" opacity="0.5" />
        <rect x="22" y="40" width="14" height="3" rx="1.5" fill="white" opacity="0.5" />
      </svg>
    ),
    name: "Leche fresca",
    description: "Directa de la vaca, sin pasteurización industrial. Próximamente en tu puerta.",
    badge: "Próximamente",
    badgeStyle: "bg-gray-100 text-gray-400 border border-gray-200",
    cta: null,
  },
  {
    available: false,
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <ellipse cx="32" cy="38" rx="20" ry="12" fill="#F0D080" />
        <rect x="12" y="26" width="40" height="14" rx="4" fill="#E8C55A" />
        <rect x="14" y="22" width="36" height="8" rx="3" fill="#F0D080" />
        <ellipse cx="22" cy="30" rx="3" ry="3" fill="#D4A820" opacity="0.4" />
        <ellipse cx="36" cy="32" rx="2.5" ry="2.5" fill="#D4A820" opacity="0.4" />
        <ellipse cx="44" cy="29" rx="2" ry="2" fill="#D4A820" opacity="0.4" />
      </svg>
    ),
    name: "Quesos artesanales",
    description: "Elaborados con técnicas tradicionales guatemaltecas. Sabor auténtico del campo.",
    badge: "Próximamente",
    badgeStyle: "bg-gray-100 text-gray-400 border border-gray-200",
    cta: null,
  },
];

export default function Products() {
  return (
    <section id="productos" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-verde-cta font-semibold text-xs sm:text-sm uppercase tracking-widest">
            Del campo a tu mesa
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-verde-principal mt-2">
            Nuestros productos
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Empezamos con los huevos. Pronto traeremos más productos directos de la granja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.name}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-200 ${
                product.available
                  ? "border-verde-principal/20 bg-verde-principal/[0.02] hover:shadow-md hover:border-verde-principal/30"
                  : "border-gray-100 bg-gray-50/50 opacity-70"
              }`}
            >
              {/* Badge */}
              <span className={`self-start inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-5 ${product.badgeStyle}`}>
                {!product.available && <Clock className="w-3 h-3" strokeWidth={2} />}
                {product.badge}
              </span>

              {/* Ícono */}
              <div className="mb-4">{product.icon}</div>

              {/* Info */}
              <h3 className={`font-bold text-lg mb-1.5 ${product.available ? "text-verde-principal" : "text-gray-400"}`}>
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                {product.description}
              </p>

              {/* CTA */}
              {product.cta ? (
                <Link
                  href={product.cta.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-verde-cta hover:text-verde-principal transition-colors"
                >
                  {product.cta.label}
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              ) : (
                <p className="mt-5 text-xs text-gray-300 font-medium">Avisaremos cuando esté disponible</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
