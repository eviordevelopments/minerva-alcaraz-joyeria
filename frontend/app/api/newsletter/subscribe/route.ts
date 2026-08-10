import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "../../../../lib/email/resend";
import { getNewsletterWelcomeTemplate } from "../../../../lib/email/templates";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Correo electrónico no válido." },
        { status: 400 }
      );
    }

    // Insert subscriber into Supabase newsletter_subscribers (or ignore if exists)
    const { error: dbError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: "email" });

    if (dbError) {
      console.warn("Database notice for newsletter subscriber:", dbError.message);
    }

    // Send Welcome Email
    const emailHtml = getNewsletterWelcomeTemplate({ email });
    await sendEmail({
      to: email,
      subject: "Bienvenido a la Herencia · Minerva Alcaraz",
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar la suscripción.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
