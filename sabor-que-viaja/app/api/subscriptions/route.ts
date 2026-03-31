import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import type { EggSize } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_uuid, plan_type, egg_size = "large" } = body;

    if (!user_uuid || !plan_type) {
      return NextResponse.json(
        { error: "user_uuid y plan_type son requeridos." },
        { status: 400 }
      );
    }

    if (!["30", "60"].includes(plan_type)) {
      return NextResponse.json(
        { error: "plan_type debe ser '30' o '60'." },
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

    // Leer plan desde la DB
    const plan = await db("plans")
      .where({ eggs_per_week: parseInt(plan_type), egg_size: egg_size as EggSize, active: true })
      .first();

    if (!plan) {
      return NextResponse.json({ error: "Plan no disponible." }, { status: 404 });
    }

    const uuid = uuidv4();

    await db("subscriptions").insert({
      uuid,
      user_id: user.id,
      plan_type,
      egg_size,
      eggs_per_week: plan.eggs_per_week,
      price_monthly: plan.price_monthly,
      status: "active",
    });

    return NextResponse.json(
      { uuid, eggs_per_week: plan.eggs_per_week, price_monthly: plan.price_monthly },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/subscriptions]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
