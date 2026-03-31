"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";

interface Order {
  uuid: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  delivery_date: string;
  created_at: string;
  status: "pending" | "confirmed";
  subscription_id: number | null;
}

const PRODUCT_LABEL: Record<string, string> = {
  huevos_pequeño: "Pequeño",
  huevos_grande: "Grande",
};

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async (p: number) => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders?page=${p}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setOrders(data.orders);
    setTotal(data.total);
    setLimit(data.limit);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchOrders(page); }, [page, fetchOrders]);

  async function toggleStatus(uuid: string, current: string) {
    const next = current === "pending" ? "confirmed" : "pending";
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, status: next }),
    });
    setOrders((prev) => prev.map((o) => o.uuid === uuid ? { ...o, status: next as any } : o));
  }

  const totalPages = Math.ceil(total / limit);
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50212345678";

  function waUrl(order: Order) {
    const type = order.subscription_id ? "suscripción" : "pedido único";
    const msg = `Hola ${order.name}! Te contactamos de Sabor que viaja para coordinar tu ${type} de ${order.quantity} huevos (${PRODUCT_LABEL[order.product] ?? order.product}). ¿Cuándo te viene bien la entrega?`;
    return `https://wa.me/${order.phone}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Pedidos</h1>
            <p className="text-sm text-gray-400">{total} en total</p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
              document.cookie = "admin_session=; max-age=0; path=/";
              router.push("/admin/login");
            }}
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Cerrar sesión
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Cargando...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No hay pedidos aún.</div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.uuid} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{order.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.subscription_id ? "bg-verde-principal/10 text-verde-principal" : "bg-gray-100 text-gray-500"
                    }`}>
                      {order.subscription_id ? "Suscripción" : "Único"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{order.address}</p>
                  <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                    <span>{order.quantity} huevos · {PRODUCT_LABEL[order.product] ?? order.product}</span>
                    <span>Entrega: {new Date(order.delivery_date).toLocaleDateString("es-GT")}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleStatus(order.uuid, order.status)}
                    title={order.status === "pending" ? "Marcar como confirmado" : "Marcar como pendiente"}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      order.status === "confirmed"
                        ? "bg-verde-principal border-verde-principal text-white"
                        : "border-gray-200 text-gray-300 hover:border-verde-principal hover:text-verde-principal"
                    }`}
                  >
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </button>

                  <a
                    href={waUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
                    {order.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-verde-principal hover:text-verde-principal disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-verde-principal hover:text-verde-principal disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
