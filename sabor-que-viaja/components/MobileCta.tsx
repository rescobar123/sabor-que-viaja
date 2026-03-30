"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function MobileCta() {
  const pathname = usePathname();

  // No mostrar en las páginas de pedido y confirmación
  if (pathname !== "/") return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
      <Link
        href="/pedido"
        className="pointer-events-auto flex items-center justify-center gap-2 w-full bg-amarillo hover:bg-yellow-400 active:bg-yellow-500 text-verde-principal font-bold py-4 px-6 rounded-2xl shadow-xl text-base transition-colors"
      >
        Suscribirme ahora
        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
