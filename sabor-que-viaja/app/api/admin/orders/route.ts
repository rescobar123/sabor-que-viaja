import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 15;
  const offset = (page - 1) * limit;

  const [orders, [{ total }]] = await Promise.all([
    db("orders")
      .join("users", "orders.user_id", "users.id")
      .leftJoin("subscriptions", "orders.subscription_id", "subscriptions.id")
      .select(
        "orders.uuid",
        "orders.status",
        "orders.delivery_date",
        "orders.product",
        "orders.quantity",
        "orders.created_at",
        "users.name",
        "users.phone",
        "users.address",
        "subscriptions.id as subscription_id"
      )
      .orderBy("orders.created_at", "desc")
      .limit(limit)
      .offset(offset),
    db("orders").count("* as total"),
  ]);

  return NextResponse.json({ orders, total: Number(total), page, limit });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { uuid, status } = await req.json();
  await db("orders").where({ uuid }).update({ status });
  return NextResponse.json({ ok: true });
}
