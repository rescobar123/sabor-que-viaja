import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import type { EggSize } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_uuid, egg_size = "large", cartons_per_week } = body;

    if (!user_uuid || !cartons_per_week) {
      return NextResponse.json(
        { error: "user_uuid y cartons_per_week son requeridos." },
        { status: 400 }
      );
    }

    if (!["small", "large"].includes(egg_size)) {
      return NextResponse.json(
        { error: "egg_size debe ser 'small' o 'large'." },
        { status: 400 }
      );
    }

    const user = await db("users").where({ uuid: user_uuid }).first();
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    const prices = await db("egg_prices").where({ egg_size: egg_size as EggSize }).first();
    if (!prices) {
      return NextResponse.json({ error: "Precio no disponible." }, { status: 404 });
    }

    const eggs_per_week = cartons_per_week * 30;
    const price_monthly = +(Number(prices.sub_price_per_carton) * cartons_per_week * 4).toFixed(2);

    const uuid = uuidv4();
    await db("subscriptions").insert({
      uuid,
      user_id: user.id,
      plan_type: String(cartons_per_week),
      egg_size,
      eggs_per_week,
      price_monthly,
      status: "active",
    });

    return NextResponse.json({ uuid, eggs_per_week, price_monthly }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/subscriptions]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
