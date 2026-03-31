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
  const status = searchParams.get("status") ?? "pending";
  const limit = 15;
  const offset = (page - 1) * limit;

  const type = searchParams.get("type") ?? "all"; // "subscription" | "one_time" | "all"

  const baseQuery = () =>
    db("orders")
      .join("users", "orders.user_id", "users.id")
      .leftJoin("subscriptions", "orders.subscription_id", "subscriptions.id")
      .modify((q) => {
        if (status !== "all") q.where("orders.status", status);
        if (type === "subscription") q.whereNotNull("orders.subscription_id");
        if (type === "one_time") q.whereNull("orders.subscription_id");
      });

  const [orders, [{ total }]] = await Promise.all([
    baseQuery()
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
    baseQuery().count("* as total"),
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
