import { Resend } from "resend";

export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
export const RESEND_DOMAIN = "minervaalcarazjoyeria.mx";

// Default sender identity
export const DEFAULT_SENDER = `Minerva Alcaraz <concierge@${RESEND_DOMAIN}>`;
export const FALLBACK_SENDER = `Minerva Alcaraz <onboarding@resend.dev>`;

let resendInstance: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY || "re_dummy_key_for_build";
    resendInstance = new Resend(key);
  }
  return resendInstance;
}

// Proxy export for backward compatibility with `import { resend }`
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResendClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/**
 * Register domain with Resend API
 */
export async function registerResendDomain() {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("[Resend] RESEND_API_KEY is not configured.");
      return { success: false, error: "RESEND_API_KEY is missing." };
    }
    const data = await getResendClient().domains.create({ name: RESEND_DOMAIN });
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
    if (!process.env.RESEND_API_KEY) {
      console.warn("[Resend] Skipped sending email (RESEND_API_KEY not configured):", subject);
      return { success: false, error: "RESEND_API_KEY missing" };
    }

    const client = getResendClient();
    // Attempt with custom domain sender
    let response = await client.emails.send({
      from: DEFAULT_SENDER,
      to,
      subject,
      html,
      replyTo,
    });

    if (response.error && response.error.message?.includes("domain")) {
      // Fallback to resend onboarding sender if domain verification is pending
      response = await client.emails.send({
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

