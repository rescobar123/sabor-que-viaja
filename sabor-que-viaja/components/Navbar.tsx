import Link from "next/link";
import FarmLogo from "@/components/FarmLogo";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-verde-principal/95 backdrop-blur-sm shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <FarmLogo size={34} />
          <span className="text-white font-bold text-lg tracking-tight leading-none">
            Sabor que viaja
          </span>
        </Link>
        <Link
          href="/pedido"
          className="bg-amarillo hover:bg-yellow-400 text-verde-principal font-bold px-5 py-2.5 rounded-full text-sm transition-colors duration-200 shadow-sm"
        >
          Hacer pedido
        </Link>
      </div>
    </nav>
  );
}
