import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Adding system prompt to make it act like Minerva Alcaraz's concierge
    const openRouterMessages = [
      {
        role: "system",
        content: "Eres el Concierge Digital de Minerva Alcaraz Joyería, una marca de alta joyería de lujo en México. Tu tono es elegante, poético, servicial y experto. Ayudas a los clientes a encontrar joyas (anillos, collares, pulseras, pendientes), hablas de los materiales (Plata .925, Oro, Piedras naturales) y ofreces diseños personalizados. Mantén tus respuestas concisas y amables."
      },
      ...messages
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://minervaalcarazjoyeria.mx", 
        "X-Title": "Minerva Alcaraz Joyería"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: openRouterMessages,
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
