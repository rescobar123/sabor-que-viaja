import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_uuid, subscription_uuid, delivery_date, product, quantity } = body;

    if (!user_uuid || !delivery_date) {
      return NextResponse.json(
        { error: "user_uuid y delivery_date son requeridos." },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "quantity debe ser mayor a 0." },
        { status: 400 }
      );
    }

    const user = await db("users").where({ uuid: user_uuid }).first();
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    let subscription_id: number | null = null;
    if (subscription_uuid) {
      const sub = await db("subscriptions").where({ uuid: subscription_uuid }).first();
      subscription_id = sub?.id ?? null;
    }

    const uuid = uuidv4();

    await db("orders").insert({
      uuid,
      user_id: user.id,
      subscription_id,
      status: "pending",
      delivery_date,
      product: product || "huevos",
      quantity,
    });

    return NextResponse.json({ uuid }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
