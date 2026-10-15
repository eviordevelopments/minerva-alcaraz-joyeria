import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "El registro y creación de nuevas cuentas de administración ha sido deshabilitado." },
    { status: 403 }
  );
}

