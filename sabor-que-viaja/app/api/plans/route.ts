import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const eggPrices = await db("egg_prices").select("*");

    const parsed = eggPrices.map((ep: any) => ({
      ...ep,
      price_per_carton: Number(ep.price_per_carton),
      sub_price_per_carton: Number(ep.sub_price_per_carton),
    }));

    return NextResponse.json({ eggPrices: parsed });
  } catch (error) {
    console.error("[GET /api/plans]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
