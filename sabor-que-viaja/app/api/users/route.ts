import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address } = body;

    if (!name?.trim() || !phone?.trim() || !address?.trim()) {
      return NextResponse.json(
        { error: "Nombre, teléfono y dirección son requeridos." },
        { status: 400 }
      );
    }

    const uuid = uuidv4();

    await db("users").insert({
      uuid,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    return NextResponse.json({ uuid }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
