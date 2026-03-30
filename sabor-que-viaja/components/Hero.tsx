import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-verde-principal overflow-hidden pt-16">

      {/* Fondo — formas geométricas sutiles */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {/* Círculo grande superior derecha */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        {/* Círculo mediano inferior izquierda */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-amarillo/10" />
        {/* Líneas de campo */}
        <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 120" fill="none">
          <path d="M0 60 Q360 0 720 60 Q1080 120 1440 60 L1440 120 L0 120 Z" fill="white" />
        </svg>
        {/* Silueta de trigo — izquierda */}
        <svg className="absolute bottom-8 left-6 sm:left-12 opacity-20 h-32 sm:h-48" viewBox="0 0 40 120" fill="none">
          <line x1="20" y1="120" x2="20" y2="30" stroke="#F4C542" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="20" cy="22" rx="8" ry="12" fill="#F4C542"/>
          <line x1="20" y1="80" x2="8" y2="65" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="5" cy="59" rx="5" ry="8" fill="#F4C542"/>
          <line x1="20" y1="70" x2="32" y2="55" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="35" cy="49" rx="5" ry="8" fill="#F4C542"/>
        </svg>
        {/* Silueta de trigo — derecha */}
        <svg className="absolute bottom-8 right-6 sm:right-12 opacity-20 h-28 sm:h-40" viewBox="0 0 40 120" fill="none">
          <line x1="20" y1="120" x2="20" y2="35" stroke="#F4C542" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="20" cy="27" rx="7" ry="10" fill="#F4C542"/>
          <line x1="20" y1="75" x2="10" y2="62" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="7" cy="56" rx="4.5" ry="7" fill="#F4C542"/>
          <line x1="20" y1="68" x2="30" y2="55" stroke="#F4C542" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="33" cy="49" rx="4.5" ry="7" fill="#F4C542"/>
        </svg>
      </div>

      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto w-full">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-amarillo/20 border border-amarillo/40 text-amarillo font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amarillo inline-block" />
          Del pueblo a tu mesa
        </span>

        {/* Título */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-5">
          Sabor que{" "}
          <span className="text-amarillo">viaja</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-xl text-white/85 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Huevos frescos de granjas guatemaltecas,{" "}
          <strong className="text-white font-semibold">directo a tu puerta</strong> cada semana.
          Sin intermediarios. Sin conservantes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <Link
            href="/pedido?mode=subscription"
            className="bg-amarillo hover:bg-yellow-400 active:bg-yellow-500 text-verde-principal font-bold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Suscribirme
          </Link>
          <Link
            href="/pedido?mode=one_time"
            className="border-2 border-white/60 text-white hover:border-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-200"
          >
            Hacer un pedido
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-6 text-white/80 text-sm">
          {[
            "100% frescos",
            "Entrega semanal",
            "Sin compromiso",
            "Granjas locales",
          ].map((label) => (
            <span key={label} className="flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amarillo flex-shrink-0" strokeWidth={2.5} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Flecha scroll — oculta en mobile */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
