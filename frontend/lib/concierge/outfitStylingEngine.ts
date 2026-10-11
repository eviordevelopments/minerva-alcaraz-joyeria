/**
 * Intelligent Concierge Outfit & Styling Engine
 * Minerva Alcaraz Joyería
 *
 * Genera recomendaciones estilísticas inteligentes y únicas para cada joya
 * analizando su categoría, colección, materiales, silueta y caída de la luz.
 */

export interface ConciergeStylingAdvice {
  narrative: string;
  outfits: string[];
  stylingNote: string;
}

interface ProductStylingInput {
  id?: string;
  sku?: string;
  name?: string;
  category?: string;
  collection?: string;
  materials?: string[];
  outfits?: string[];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ── Perfiles estilísticos por categoría y atributos ──────────────────────────

interface StylingArchetype {
  narratives: string[];
  outfitPicks: string[][];
  notes: string[];
}

const CATEGORY_ARCHETYPES: Record<string, StylingArchetype> = {
  anillos: {
    narratives: [
      "Nuestro concierge ha analizado el volumen y la refracción del metal en esta pieza. Sugiere lucirla con mangas tres cuartos o sastrería estructurada con puños descubiertos para que el movimiento natural de las manos sea el protagonista.",
      "Para esta pieza de marcada personalidad, nuestro concierge recomienda combinarla con prendas de punto suave, lino lavado o cashmere en tonos neutros, permitiendo que el brillo artesanal resalte sobre texturas mate.",
      "El concierge de estilo aconseja contrastar la presencia de este anillo con cortes arquitectónicos y prendas monocromáticas en tonos oscuros, dejando que la silueta escultórica de la joya eleve cualquier atuendo.",
      "Recomendado por nuestro concierge para portar con vestidos fluidos de crepé o conjuntos sastreros minimalistas. La anatomía de la pieza aporta un destello íntimo que complementa tanto el día como la noche."
    ],
    outfitPicks: [
      ["Sastrería en Lana Fría", "Manga Francesa", "Tonos Carbón & Ébano"],
      ["Suéter de Cashmere", "Vestido de Crepé", "Lino Suave"],
      ["Traje Sastre Minimalista", "Camisería de Popelina", "Negro Profundo"],
      ["Vestido Lencero de Satén", "Punto Calado Fino", "Tonos Marfil & Hueso"]
    ],
    notes: [
      "Armonía en manos y silueta",
      "Contraste de textura mate vs pulido",
      "Proporción anatómica refinada"
    ]
  },
  aretes: {
    narratives: [
      "Nuestro concierge sugiere portar esta pieza con peinados recogidos hacia atrás o cabello despejado del rostro. La caída vertical del metal alarga el perfil y dialoga a la perfección con escotes asimétricos o blazers sin solapa.",
      "El análisis del concierge destaca la delicadeza con que la luz baña esta joya. Es ideal para acompañar un vestido de cuello cisne en seda o un escote en V despejado, aportando un destello de luz al rostro sin sobrecargar.",
      "Recomendado para estilismos limpios y hombros definidos. Su presencia escultórica funciona como el acento luminoso definitivo para un traje de noche o un vestido camisero de alta costura.",
      "Nuestro concierge recomienda enmarcar esta joya con tejidos naturales como lino rústico o gasa de seda. Un look con hombros descubiertos permite que la pieza capture cada destello en movimiento."
    ],
    outfitPicks: [
      ["Recogido Estructurado", "Blazer Esmoquin", "Escote Asimétrico"],
      ["Cuello Cisne de Seda", "Escote en V Despejado", "Hombros Definidos"],
      ["Vestido Strapless de Noche", "Camisería Alta Costura", "Monocromático"],
      ["Hombros Descubiertos", "Gasa de Seda Marfil", "Lino Italiano"]
    ],
    notes: [
      "Enmarcado del rostro y cuello",
      "Juego de luces en movimiento",
      "Geometría vertical estilizada"
    ]
  },
  collares: {
    narratives: [
      "Nuestro concierge ha examinado la caída y el reposo de esta pieza sobre la clavícula. Sugiere portarla sobre un escote halter en crepé o directamente contra la piel con un vestido strapless de satén líquido.",
      "Para magnificar la presencia de esta joya, nuestro concierge sugiere acompañarla con una camisa de seda entreabierta o solapas desestructuradas. La luz del metal resalta sobre piel bronceada o tejidos en tonos ébano.",
      "El concierge recomienda maridar esta joya con un vestido de noche en terciopelo o un traje sastre con escote en pico, logrando un equilibrio impecable entre autoridad y sensualidad silenciosa.",
      "La fluidez de esta pieza exige prendas de líneas puras. Nuestro concierge aconseja vestidos de lino minimalista o prendas de cuello barco para permitir que el colgante sea el epicentro visual absoluto."
    ],
    outfitPicks: [
      ["Escote Halter en Crepé", "Satén Líquido Negro", "Vestido Strapless"],
      ["Camisa de Seda Abierta", "Solapas Desestructuradas", "Texturas Terrosas"],
      ["Terciopelo Azul Medianoche", "Traje con Escote en Pico", "Silueta Esculpida"],
      ["Cuello Barco", "Lino Minimalista", "Crepé de Seda Marfil"]
    ],
    notes: [
      "Caída sobre clavícula y escote",
      "Epicentro visual del atuendo",
      "Geometría orgánica en reposo"
    ]
  },
  pulseras: {
    narratives: [
      "Nuestro concierge sugiere portar esta joya directamente sobre la muñeca desnuda con prendas sin mangas o deslizada sutilmente sobre el puño ceñido de una blusa de seda, creando un contraste arquitectónico.",
      "La ergonomía de esta pieza ha sido concebida para acompañar el ritmo cotidiano con elegancia. El concierge recomienda combinarla con vestidos veraniegos de lino fino o suéteres de hilo mercerizado.",
      "Para eventos de etiqueta, nuestro concierge recomienda acompañar este brazalete con un vestido de cóctel monocromático, permitiendo que el metal pulido refleje la iluminación nocturna.",
      "Un balance de fuerza y sutileza: el concierge aconseja acompañar esta pieza con sastrería relajada y accesorios de cuero fino, destacando la artesanía del cierre y el ensamble."
    ],
    outfitPicks: [
      ["Vestido Sin Mangas", "Puño Ceñido de Seda", "Piel & Metal Puro"],
      ["Lino Fino Italiano", "Punto Calado Ligero", "Tonos Salvia & Hueso"],
      ["Vestido de Cóctel Ébano", "Satén de Noche", "Minimalismo Puro"],
      ["Sastrería Relajada", "Cuero Fino", "Texturas de Algodón Egipcio"]
    ],
    notes: [
      "Acorde en muñeca y movimiento",
      "Contraste de puños y silueta",
      "Ergonomía de alta comodidad"
    ]
  },
  dijes: {
    narratives: [
      "Nuestro concierge sugiere llevar este dije en solitario sobre cadenas finas con un vestido camisero de popelina o blusas de cuello henley en lino puro, proyectando una sofisticación sobria.",
      "La carga simbólica de esta pieza se magnifica con prendas de escote corazón o prendas lenceras en satén. El concierge sugiere evitar estampados densos para respetar el protagonismo de la gema.",
      "Recomendado por nuestro concierge para superponer en un 'layering' íntimo o portar como amuleto visible sobre un suéter de lana merino de escote redondo.",
      "El concierge destaca la armonía de la luz en esta pieza: perfecta con escote desbocado en seda natural o lino crudo para eventos al aire libre o recepciones privadas."
    ],
    outfitPicks: [
      ["Popelina Blanca Pura", "Lino Crudo Lavado", "Cuello Henley"],
      ["Escote Corazón", "Satén Lencero", "Colores Monocromáticos"],
      ["Lana Merino Extra Fina", "Layering Sutil", "Escote Redondo"],
      ["Seda Natural Marfil", "Escote Desbocado", "Tonos Tierra & Arena"]
    ],
    notes: [
      "Sutileza íntima cotidiana",
      "Diálogo con la piel",
      "Amuleto de sofisticación sobria"
    ]
  },
  sets: {
    narratives: [
      "El concierge recomienda lucir este conjunto como una declaración de estilo integral en galas o veladas formales. Un vestido de corte columna en crepe negro o marfil permite que el diálogo entre las piezas resplandezca sin competencia.",
      "Para un impacto sofisticado, nuestro concierge aconseja acompañar este set con un esmoquin femenino en satén negro, equilibrando la fuerza del metal con una sastrería impecable.",
      "Nuestro concierge sugiere reservar este set para celebraciones memorables, portándolo con vestidos drapeados en tonos joya como esmeralda o borgoña profundo.",
      "La sinergia de este conjunto ha sido curada por el concierge para ceremonias y rituales íntimos: ideal con tejidos de caída regia como terciopelo o brocado sutil."
    ],
    outfitPicks: [
      ["Corte Columna en Crepe", "Marfil & Negro Ébano", "Black-Tie Elegance"],
      ["Esmoquin Femenino en Satén", "Solapas en Seda", "Líneas Puras"],
      ["Vestido Drapeado Borgoña", "Tonos Esmeralda Profundo", "Gala Arquitectónica"],
      ["Terciopelo Regio", "Brocado Sutil", "Ceremonia & Legado"]
    ],
    notes: [
      "Sinergia de conjunto total",
      "Equilibrio de múltiples piezas",
      "Impacto ceremonial de gala"
    ]
  }
};

// ── Modulaciones por Colección ───────────────────────────────────────────────

const COLLECTION_NUANCES: Record<string, { tags: string[]; phrase: string }> = {
  chai: {
    tags: ["Sastrería Arquitectónica", "Negro Ébano", "Estructura Pura"],
    phrase: "La fuerza estructural de la colección Chai demanda prendas con presencia y cortes limpios."
  },
  latidos: {
    tags: ["Lino Lavado Orgánico", "Tonos Borgoña & Tierra", "Seda Cálida"],
    phrase: "Inspirada en el pulso vital, dialoga armónicamente con texturas suaves y telas que abrazan el cuerpo."
  },
  eterea: {
    tags: ["Organza Vaporosa", "Chifón de Seda", "Tonos Champaña"],
    phrase: "La ligereza efímera de Etérea encuentra su mejor aliada en tejidos traslúcidos y siluetas etéreas."
  },
  floral: {
    tags: ["Encaje Delicado", "Escote Bardot", "Vestido Romántico Fluido"],
    phrase: "La feminidad botánica de Floral sugiere estilismos con caída libre y detalles sutiles."
  },
  escencia: {
    tags: ["Terciopelo Joya", "Seda Jacquard", "Azul Medianoche"],
    phrase: "El misticismo de Escencia resalta con tejidos ricos y paletas cromáticas profundas."
  },
  serpientes: {
    tags: ["Satén Ceñido", "Espalda Descubierta", "Sensualidad Líquida"],
    phrase: "El instinto y magnetismo de esta pieza reclaman líneas sensuales y espaldas pronunciadas."
  },
  instinto: {
    tags: ["Cuero Fino", "Vestido Ceñido Esculpido", "Texturas Contrastantes"],
    phrase: "Una joya que expresa fuerza interior: perfecta con contrastes de cuero y satén."
  },
  "ecos de la tierra": {
    tags: ["Lino Rústico", "Cachemira Natural", "Verde Bosque & Arena"],
    phrase: "Conexión ancestral con la tierra: ideal con lino lavado, lana natural y tonos orgánicos."
  },
  "diseños de autor": {
    tags: ["Alta Costura Vanguardista", "Silueta Monocromática", "Drapeado Escultural"],
    phrase: "Al tratarse de una obra de autor, el atuendo debe actuar como lienzo limpio para la escultura portable."
  },
  "piezas únicas": {
    tags: ["Vestido de Gala Exclusivo", "Tejidos Nobles", "Elegancia Irrepetible"],
    phrase: "Una pieza irrepetible merece prendas de alta factura donde la joya sea el centro de todas las miradas."
  },
  renacer: {
    tags: ["Seda Plisada", "Tonos Salvia & Oro", "Transformación Fluida"],
    phrase: "Celebrando la transformación constante: perfecta con plisados en seda y cortes asimétricos."
  }
};

/**
 * Función principal que calcula la recomendación personalizada
 */
export function getConciergeStylingRecommendation(product: ProductStylingInput): ConciergeStylingAdvice {
  // Si el producto ya tiene outfits personalizados definidos por el admin, respetarlos
  const hasCustomOutfits = product.outfits && product.outfits.length > 0;

  const seedStr = `${product.id || ""}-${product.sku || ""}-${product.name || ""}-${product.category || ""}`;
  const seed = hashString(seedStr);

  // Normalizar categoría
  const cat = (product.category || "").toLowerCase();
  let archetypeKey = "anillos";
  if (cat.includes("collar") || cat.includes("gargantilla")) {
    archetypeKey = "collares";
  } else if (cat.includes("arete") || cat.includes("candonga") || cat.includes("broquel")) {
    archetypeKey = "aretes";
  } else if (cat.includes("pulsera") || cat.includes("brazalete")) {
    archetypeKey = "pulseras";
  } else if (cat.includes("dije")) {
    archetypeKey = "dijes";
  } else if (cat.includes("set") || cat.includes("juego")) {
    archetypeKey = "sets";
  }

  const archetype = CATEGORY_ARCHETYPES[archetypeKey] || CATEGORY_ARCHETYPES.anillos;
  const narrativeIndex = seed % archetype.narratives.length;
  const outfitIndex = seed % archetype.outfitPicks.length;
  const noteIndex = seed % archetype.notes.length;

  // Colección
  const colKey = (product.collection || "").toLowerCase().trim();
  const collectionNuance = COLLECTION_NUANCES[colKey];

  // Material / Metal
  const materialsStr = (product.materials || []).join(" ").toLowerCase();
  const isOro = materialsStr.includes("oro") || materialsStr.includes("14k") || materialsStr.includes("18k");
  const isPlata = materialsStr.includes("plata") || materialsStr.includes("925");
  const isGema = materialsStr.includes("amatista") || materialsStr.includes("opalo") || materialsStr.includes("esmeralda") || materialsStr.includes("perla") || materialsStr.includes("diamante");

  let baseNarrative = archetype.narratives[narrativeIndex];

  // Si hay matiz de colección, enriquecer la recomendación con la visión del concierge
  if (collectionNuance && (seed % 2 === 0)) {
    baseNarrative = `${collectionNuance.phrase} ${baseNarrative}`;
  } else if (isOro && (seed % 3 === 0)) {
    baseNarrative = `La calidez radiante del oro en esta pieza se intensifica en contraste con texturas nobles. ${baseNarrative}`;
  } else if (isPlata && (seed % 3 === 0)) {
    baseNarrative = `El lustre lunar y pulido de la plata .925 requiere un diálogo con tonos sobrios. ${baseNarrative}`;
  } else if (isGema && (seed % 3 === 0)) {
    baseNarrative = `El destello natural de la piedra seleccionada exige prendas sin patrones recargados. ${baseNarrative}`;
  }

  // Outfits
  let selectedOutfits: string[];
  if (hasCustomOutfits) {
    selectedOutfits = product.outfits!;
  } else if (collectionNuance && (seed % 2 === 0)) {
    selectedOutfits = collectionNuance.tags;
  } else {
    selectedOutfits = archetype.outfitPicks[outfitIndex];
  }

  const selectedNote = archetype.notes[noteIndex];

  return {
    narrative: baseNarrative,
    outfits: selectedOutfits,
    stylingNote: selectedNote
  };
}
