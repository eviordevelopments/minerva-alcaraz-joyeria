import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS as STATIC_PRODUCTS } from "../../../constants/products";

// Initialize server-side Supabase client for reading active products
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json();

    // 1. Fetch dynamic products from Supabase
    let catalog = STATIC_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      collection: p.collection || "General",
      category: p.category || "Joyería",
      price: p.price,
      materials: p.materials,
      significado: p.significado || p.description || "",
    }));

    try {
      const { data: dbProducts, error: dbError } = await supabase
        .from("products")
        .select("id, name, collection_name, category, price_cents, materials, significado, description, is_active")
        .eq("is_active", true);

      if (!dbError && dbProducts && dbProducts.length > 0) {
        const normalizedDb = dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          collection: p.collection_name || "General",
          category: p.category || "Joyería",
          price: Math.round((p.price_cents || 0) / 100),
          materials: Array.isArray(p.materials)
            ? p.materials
            : p.materials
            ? [p.materials]
            : ["Plata Ley .925"],
          significado: p.significado || p.description || "",
        }));

        // Merge DB products with static products without duplicate names
        const dbNames = new Set(normalizedDb.map((p) => p.name.trim().toLowerCase()));
        const uniqueStatic = catalog.filter(
          (p) => !dbNames.has(p.name.trim().toLowerCase())
        );
        catalog = [...normalizedDb, ...uniqueStatic];
      }
    } catch (err) {
      console.warn("Notice: Using static products fallback for chat catalog:", err);
    }

    // 2. Extract verified collections declared in boutique
    const officialCollections = [
      ...new Set(catalog.map((p) => p.collection).filter(Boolean)),
    ];

    // 3. Structured product listing for LLM grounding
    const productList = catalog
      .map(
        (p) =>
          `- [ID: ${p.id}] "${p.name}" | Colección: ${p.collection} | Categoría: ${p.category} | Precio: $${p.price.toLocaleString("es-MX")} MXN | Materiales: ${
            Array.isArray(p.materials) ? p.materials.join(", ") : p.materials
          }${p.significado ? ` | Símbolo: ${p.significado}` : ""}`
      )
      .join("\n");

    // 4. Strict Guardrails System Prompt
    const systemPrompt = `Eres el Concierge Digital oficial de Minerva Alcaraz Joyería, una exclusiva casa de alta joyería de autor y lujo en México.
Tu tono es elegante, poético, profundamente cortés, empático y profesional.
${
  userName
    ? `El cliente con el que hablas se llama ${userName}. Dirígete a él/ella con distinción.`
    : `Preséntate como el Concierge Digital de Minerva Alcaraz Joyería.`
}

═════════════════════════════════════════════════════════════════
COLECCIONES OFICIALES DISPONIBLES EN LA BOUTIQUE:
${officialCollections.join(", ")}
═════════════════════════════════════════════════════════════════

CATÁLOGO REAL Y EXCLUSIVO DE PIEZAS ACTIVAS (${catalog.length} piezas):
${productList}

═════════════════════════════════════════════════════════════════
LÍMITES ESTRICTOS Y GUARDARRAÍLES (CUMPLIMIENTO ABSOLUTO):
1. PROHIBICIÓN TOTAL DE INVENTAR O ALUCINAR:
   - Tienes ESTRICTAMENTE PROHIBIDO inventar piezas, nombres de joyas, materiales, gemas, precios, descuentos o colecciones inexistentes.
   - NUNCA inventes colecciones que no figuren en la lista oficial anterior (por ejemplo, nunca inventes "Galaxia", "Celestial", "Diamante Supremo", etc.).
   - Solo puedes sugerir, confirmar o cotizar piezas que aparezcan explícitamente en el catálogo real anterior.
   - Si un usuario pregunta por un producto, joya, colección, gema o diseño que NO existe en el catálogo anterior, DEBES responder con sinceridad y elegancia:
     "Esa pieza o colección no forma parte de nuestro catálogo disponible actualmente. No obstante, en nuestro Atelier de San Miguel de Allende ofrecemos el servicio exclusivo de Co-Creación y diseño personalizado, donde podemos forjar tu visión a la medida con nuestras maestras manos orfebres."

2. ETIQUETA DE RECOMENDACIÓN OBLIGATORIA:
   - Cuando recomiendes piezas específicas del catálogo, selecciona las 2 a 4 piezas más afines y destacadas para no saturar al cliente, e incluye SIEMPRE al final de tu respuesta la etiqueta oculta con los IDs exactos de los productos separados por comas, así:
     <recommend>ID1, ID2, ID3</recommend>
   - Solo incluye IDs de productos que existan en el catálogo. Si no hay productos pertinentes o el cliente solo saluda o pregunta por políticas, NO incluyas la etiqueta <recommend>.

3. POLÍTICAS CORPORATIVAS OFICIALES:
   - Política de Devoluciones: 10 días naturales desde la entrega para compras generales y 30 días naturales extendidos exclusivos para miembros de THE CIRCLE. Las piezas personalizadas en co-creación no son reembolsables.
   - Tallas: NO prometas cambio de talla gratuito sin costo de forma indiscriminada. Recomienda consultar la Guía de Tallas interactiva en la página o contactar al Atelier para cotizar ajustes especiales.
   - Envíos: Envíos asegurados y prioritarios a toda la República Mexicana (gratuito a partir de compras de $2,000 MXN).
   - Presencia Física: Atelier en San Miguel de Allende, Gto., y showroom en Floroteca (Av. Mariano J. García 1568, Irapuato, Gto.).
   - THE CIRCLE: Membresía de lealtad con acumulación de puntos, atención personalizada y 30 días de devolución extendida.

4. FORMATO:
   - Responde de forma concisa (máximo 2 a 3 párrafos).
   - Mantén un lenguaje de lujo artesanal impecable en español.`;

    const openRouterMessages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ];

    // Primary model with fallback
    let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://minervaalcarazjoyeria.mx",
        "X-Title": "Minerva Alcaraz Joyería",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: openRouterMessages,
        temperature: 0.2, // Strict temperature to anchor factual precision
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.warn("Primary model attempt failed, trying fallback model...");
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://minervaalcarazjoyeria.mx",
          "X-Title": "Minerva Alcaraz Joyería",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.2-24b-instruct",
          messages: openRouterMessages,
          temperature: 0.2,
          max_tokens: 600,
        }),
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
