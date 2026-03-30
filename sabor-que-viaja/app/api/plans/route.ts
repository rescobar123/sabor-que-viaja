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

    return NextResponse.json({ plans, eggPrices });
  } catch (error) {
    console.error("[GET /api/plans]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
