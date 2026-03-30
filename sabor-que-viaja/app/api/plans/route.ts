import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [plans, eggPrices] = await Promise.all([
      db("plans").where({ active: true }).orderBy([
        { column: "eggs_per_week", order: "asc" },
        { column: "egg_size", order: "asc" },
      ]),
      db("egg_prices").select("*"),
    ]);

    const parsedPlans = plans.map((p: any) => ({
      ...p,
      price_monthly: Number(p.price_monthly),
    }));

    const parsedEggPrices = eggPrices.map((ep: any) => ({
      ...ep,
      price_per_egg: Number(ep.price_per_egg),
      price_per_carton: Number(ep.price_per_carton),
    }));

    return NextResponse.json({ plans: parsedPlans, eggPrices: parsedEggPrices });
  } catch (error) {
    console.error("[GET /api/plans]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
