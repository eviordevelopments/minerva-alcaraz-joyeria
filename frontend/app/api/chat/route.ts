import { NextResponse } from "next/server";
import { PRODUCTS } from "../../../constants/products";

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json();

    const productList = PRODUCTS.map(p => `- ${p.id}: ${p.name} (${p.category}, Colección ${p.collection}) - ${p.materials.join(', ')} - Precio: $${p.price} MXN - Significado: ${p.significado || "N/A"}`).join("\n");

    const systemPrompt = `Eres el Concierge Digital de Minerva Alcaraz Joyería, una marca de alta joyería de lujo en México. Tu tono es elegante, poético, servicial y experto. Ayudas a los clientes a encontrar joyas, materiales (Plata .925, Oro, Piedras naturales) y ofreces diseños personalizados (puedes mencionar THE CIRCLE para lealtad y puntos, y devoluciones en 10 días).
${userName ? `El cliente con el que estás hablando se llama ${userName}. Dirígete a él/ella por su nombre con cortesía al presentarte y al contestar.` : `Preséntate como el Concierge Digital de Minerva Alcaraz.`}

Tienes acceso a TODO el catálogo de piezas. Aquí está la lista de productos disponibles:
${productList}

REGLAS IMPORTANTES:
1. Responde de forma concisa (máx 3 párrafos).
2. Si un cliente te pregunta por recomendaciones, o si notas que alguna pieza del catálogo encaja perfectamente con su solicitud, RECOMIÉNDALA mencionando su nombre y características en el texto.
3. ADEMÁS, siempre que recomiendes productos o te pregunten qué hay disponible, DEBES incluir al final de tu mensaje una etiqueta oculta con los IDs de los productos separados por comas, así: <recommend>ID1, ID2, ID3</recommend>. La interfaz usará esto para mostrar las fotos. ¡NO OLVIDES INCLUIR LA ETIQUETA <recommend>!
`;

    const openRouterMessages = [
      {
        role: "system",
        content: systemPrompt
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
