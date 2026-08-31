import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/email/resend";
import { generateTeamInviteEmail } from "@/lib/email/templates/TeamInviteEmail";

const JWT_SECRET = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "minerva-fallback-secret-12345";

export async function POST(req: Request) {
  try {
    const { email, location, profiles } = await req.json();

    if (!email || !profiles || profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "Datos de registro incompletos." },
        { status: 400 }
      );
    }

    // 1. Generate a JWT token containing all the registration data
    // The token expires in 24 hours
    const token = jwt.sign(
      { email, location, profiles },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 2. Generate the HTML email
    const html = generateTeamInviteEmail(token);

    // 3. Send email using Resend
    const result = await sendEmail({
      to: email,
      subject: "Minerva Alcaraz - Verificación de Cuenta de Equipo",
      html,
    });

    if (!result || result.error) {
      throw new Error(result?.error?.message || "Error al enviar correo electrónico");
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Invite Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
