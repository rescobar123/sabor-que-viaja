import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaFinal() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50212345678";
  const message = "Hola! Me interesa suscribirme a Sabor que viaja";
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <section className="py-20 sm:py-28 bg-verde-principal">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <span className="inline-flex items-center gap-1.5 bg-amarillo/20 border border-amarillo/30 text-amarillo text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amarillo" />
          Empieza hoy
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
          ¿Listo para probar el{" "}
          <span className="text-amarillo">sabor real</span>?
        </h2>
        <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto mb-10">
          Únete a las familias guatemaltecas que ya disfrutan huevos frescos
          del campo cada semana. Sin contratos. Sin complicaciones.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pedido?mode=subscription"
            className="inline-flex items-center justify-center gap-2 bg-amarillo hover:bg-yellow-400 active:bg-yellow-500 text-verde-principal font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Suscribirme
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <Link
            href="/pedido?mode=one_time"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/50 hover:border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-base transition-all duration-200"
          >
            Hacer un pedido
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
