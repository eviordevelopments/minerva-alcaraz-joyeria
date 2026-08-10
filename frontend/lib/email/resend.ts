import { Resend } from "resend";

export const RESEND_API_KEY = process.env.RESEND_API_KEY!;
export const RESEND_DOMAIN = "minervaalcarazjoyeria.mx";

// Default sender identity
export const DEFAULT_SENDER = `Minerva Alcaraz <concierge@${RESEND_DOMAIN}>`;
export const FALLBACK_SENDER = `Minerva Alcaraz <onboarding@resend.dev>`;

export const resend = new Resend(RESEND_API_KEY);

/**
 * Register domain with Resend API
 */
export async function registerResendDomain() {
  try {
    const data = await resend.domains.create({ name: RESEND_DOMAIN });
    return { success: true, data };
  } catch (error: any) {
    console.error("Error registering Resend domain:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to safely send email with fallback to onboarding@resend.dev if unverified
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  try {
    // Attempt with custom domain sender
    let response = await resend.emails.send({
      from: DEFAULT_SENDER,
      to,
      subject,
      html,
      replyTo,
    });

    if (response.error && response.error.message?.includes("domain")) {
      // Fallback to resend onboarding sender if domain verification is pending
      response = await resend.emails.send({
        from: FALLBACK_SENDER,
        to,
        subject,
        html,
        replyTo,
      });
    }

    return response;
  } catch (error: any) {
    console.error("Resend Email Send Error:", error);
    throw error;
  }
}
