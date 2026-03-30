import FarmLogo from "@/components/FarmLogo";
import { MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50212345678";
  const waUrl = `https://wa.me/${number}?text=${encodeURIComponent("Hola! Me interesa suscribirme a Sabor que viaja")}`;

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 mb-10">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <FarmLogo size={30} />
              <span className="text-white font-bold text-base">Sabor que viaja</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Huevos frescos de granjas guatemaltecas, entregados directamente
              a tu puerta cada semana.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navegación</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "#que-ofrecemos", label: "Qué ofrecemos" },
                { href: "#como-funciona", label: "Cómo funciona" },
                { href: "#planes", label: "Planes" },
                { href: "#beneficios", label: "Beneficios" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contacto</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" strokeWidth={1.75} />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                Guatemala, C.A.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Sabor que viaja. Todos los derechos reservados.</span>
          <span>Hecho con cariño en Guatemala</span>
        </div>
      </div>
    </footer>
  );
}
