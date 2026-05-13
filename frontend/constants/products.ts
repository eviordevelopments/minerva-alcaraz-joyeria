// ============================================================
// Minerva Alcaraz — Catálogo de Productos
// CDN: Cloudinary dlsc3ova5
// Formato: f_auto,q_auto + timestamp real (nunca /v1/ genérico)
// ============================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: "Anillos" | "Collares" | "Pulseras" | "Sets" | "Edición Limitada" | "Piezas Únicas" | "Pendientes" | "Broches";
  collection: string;
  images: string[];
  materials: string[];
  stock: number;
  featured?: boolean;
  significado?: string;
  occasions?: string[];
  outfits?: string[];
  metadata?: {
    stone?: string;
    occasion?: string[];
    gender?: "Hombre" | "Mujer" | "Unisex";
    style?: string;
    isAuthorDesign?: boolean;
  };
}

// Helper: construir URL Cloudinary optimizada con transformaciones
const cdn = (path: string, w = 800) =>
  `https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_${w},c_limit/${path}`;

// ─── Colecciones con timestamps verificados (200 OK) ──────
const CLD = {
  // AMATISTA ─ v1778280176..177..174..175
  amatista: {
    c1_4: "v1778280176/minerva_joyeria/products/amatista/Coleccio_n_1_4.jpg",
    c1_5: "v1778280177/minerva_joyeria/products/amatista/Coleccio_n_1_5.jpg",
    c1_1: "v1778280174/minerva_joyeria/products/amatista/Coleccio_n_1_1.jpg",
    c1_2: "v1778280175/minerva_joyeria/products/amatista/Coleccio_n_1_2.jpg",
  },
  // CHAI ─ v1778275655..629..631..627..646..648..649
  chai: {
    main:  "v1778275655/minerva_joyeria/products/chai/CHAI.jpg",
    c2:    "v1778275629/minerva_joyeria/products/chai/CHAI-2.jpg",
    c21:   "v1778275631/minerva_joyeria/products/chai/CHAI-21.jpg",
    c18:   "v1778275627/minerva_joyeria/products/chai/CHAI-18.jpg",
    c4:    "v1778275646/minerva_joyeria/products/chai/CHAI-4.jpg",
    c5:    "v1778275648/minerva_joyeria/products/chai/CHAI-5.jpg",
    c6:    "v1778275649/minerva_joyeria/products/chai/CHAI-6.jpg",
  },
  // ESCENCIA ─ v1778275673..674..675..666..279752
  escencia: {
    s54:  "v1778275673/minerva_joyeria/products/escencia/SMA_MINERVA-54.jpg",
    s59:  "v1778275674/minerva_joyeria/products/escencia/SMA_MINERVA-59.jpg",
    s62:  "v1778275675/minerva_joyeria/products/escencia/SMA_MINERVA-62.jpg",
    m10:  "v1778275666/minerva_joyeria/products/escencia/Minerva_Joyeria_1_-10.jpg",
    cloud:"v1778279752/minerva_joyeria/products/escencia/s5lcje72gpht7y1eh2nw.jpg",
  },
  // SERPIENTES ─ v1778275754..755..280294
  serpientes: {
    s100: "v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg",
    s101: "v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-101_1.jpg",
    s102: "v1778275755/minerva_joyeria/products/serpientes/SMA_MINERVA-102.jpg",
    d064: "v1778280294/minerva_joyeria/products/serpientes/DSCF5064.jpg",
  },
  // FLORAL ─ v1778280281..269..282..270
  floral: {
    f1:   "v1778280281/minerva_joyeria/products/floral/FLORES_1.jpg",
    f2:   "v1778280282/minerva_joyeria/products/floral/FLORES_2.jpg",
    c3_1: "v1778280269/minerva_joyeria/products/floral/Coleccio_n_3_1.jpg",
    c3_3: "v1778280270/minerva_joyeria/products/floral/Coleccio_n_3_3.jpg",
  },
  // ETÉREA — pendiente upload (usar chai como placeholder temporal)
  // Una vez ejecutado upload_to_cloudinary.sh, actualizar con versiones reales
  eterea: {
    // Rutas que serán válidas DESPUÉS del upload con upload_to_cloudinary.sh
    m2:   "v1778294826/minerva_joyeria/products/eterea/Minerva2-2.jpg",      // POST-UPLOAD
    m3:   "v1778294828/minerva_joyeria/products/eterea/Minerva2-3.jpg",      // POST-UPLOAD
    m6:   "v1778294833/minerva_joyeria/products/eterea/Minerva2-6.jpg",      // POST-UPLOAD
    m10:  "v1778294840/minerva_joyeria/products/eterea/Minerva2-10.jpg",     // POST-UPLOAD
    m11:  "v1778294842/minerva_joyeria/products/eterea/Minerva2-11.jpg",     // POST-UPLOAD
    m15:  "v1778295532/minerva_joyeria/products/eterea/Minerva2-15.jpg",     // POST-UPLOAD
    m16:  "v1778295534/minerva_joyeria/products/eterea/Minerva2-16.jpg",     // POST-UPLOAD
    m17:  "v1778295536/minerva_joyeria/products/eterea/Minerva2-17.jpg",     // POST-UPLOAD
  },
  // INDIVIDUALES — pendiente upload
  individuales: {
    mine30: "v1778294850/minerva_joyeria/products/individuales/MINE-30.jpg",  // POST-UPLOAD
    mine51: "v1778294857/minerva_joyeria/products/individuales/MINE-51.jpg",  // POST-UPLOAD
    mine52: "v1778295601/minerva_joyeria/products/individuales/MINE-52.jpg",  // POST-UPLOAD
    mine32: "v1778294851/minerva_joyeria/products/individuales/MINE-32.jpg",  // POST-UPLOAD
    mine36: "v1778294853/minerva_joyeria/products/individuales/MINE-36.jpg",  // POST-UPLOAD
    m25:    "v1778295603/minerva_joyeria/products/individuales/Minerva2-25.jpg", // POST-UPLOAD
  },
  // ECOS DE LA TIERRA — pendiente upload (archivos >20MB, se comprimen con sips)
  ecos: {
    a1:    "v1778295634/minerva_joyeria/products/ecos-tierra/ANILLO-1.jpg",   // POST-UPLOAD
    a2:    "v1778295635/minerva_joyeria/products/ecos-tierra/ANILLO-2.jpg",   // POST-UPLOAD
    d317:  "v1778295671/minerva_joyeria/products/ecos-tierra/DSCF4317.jpg",   // POST-UPLOAD
    d318:  "v1778295673/minerva_joyeria/products/ecos-tierra/DSCF4318.jpg",   // POST-UPLOAD
  },
  // ANILLOS DE PIEDRAS — pendiente upload
  piedras: {
    s4:   "v1778294411/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-4.jpg",  // POST-UPLOAD
    s5:   "v1778294412/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-5.jpg",  // POST-UPLOAD
    s7:   "v1778294415/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-7.jpg",  // POST-UPLOAD
  },
};

export const PRODUCTS: Product[] = [
  // ── AMATISTA ──────────────────────────────────────────────
  {
    id: "amatista-luz-01",
    sku: "MA-AMA-001",
    name: "Anillo Amatista de Luz",
    description: "Una pieza que captura la esencia de la transmutación. Amatista tallada a mano con montura en plata .925 envejecida.",
    price: 3800,
    currency: "MXN",
    category: "Anillos",
    collection: "Amatista",
    images: [
      cdn(CLD.amatista.c1_4),
      cdn(CLD.amatista.c1_5),
      cdn(CLD.amatista.c1_1),
      cdn(CLD.amatista.c1_2),
    ],
    materials: ["Plata .925", "Amatista Natural"],
    stock: 5,
    featured: true,
    significado: "La amatista es la piedra de la sabiduría y la transmutación, permitiendo que el portador conecte con su paz interior.",
    occasions: ["Gala", "Ritual", "Meditación"],
    outfits: ["Seda Cruda", "Lino Blanco"],
  },

  // ── CHAI ───────────────────────────────────────────────────
  {
    id: "chai-medallon-ancestral",
    sku: "MA-CHA-001",
    name: "Medallón Chai Ancestral",
    description: "Símbolo de vida y protección. Un medallón de gran formato con detalles cincelados a mano.",
    price: 5200,
    currency: "MXN",
    category: "Collares",
    collection: "Chai",
    images: [
      cdn(CLD.chai.main),
      cdn(CLD.chai.c2),
      cdn(CLD.chai.c21),
      cdn(CLD.chai.c18),
    ],
    materials: ["Plata .925", "Baño de Oro 24k"],
    stock: 3,
    featured: true,
    significado: "El Chai representa el número 18, el valor numérico de la 'Vida'. Portarlo es celebrar el flujo constante del ser.",
    occasions: ["Celebración", "Legado"],
    outfits: ["Vestido de Gala", "Cuello Alto"],
  },
  {
    id: "chai-anillo-fluidez",
    sku: "MA-CHA-002",
    name: "Anillo Chai Fluidez",
    description: "Anillo de banda ancha con grabados rítmicos que evocan el movimiento del agua y el tiempo.",
    price: 2900,
    currency: "MXN",
    category: "Anillos",
    collection: "Chai",
    images: [
      cdn(CLD.chai.c4),
      cdn(CLD.chai.c5),
      cdn(CLD.chai.c6),
    ],
    materials: ["Plata .925"],
    stock: 8,
    significado: "Representa la capacidad de adaptarse y fluir con los ciclos de la naturaleza.",
    occasions: ["Cotidiano Elegante"],
    outfits: ["Minimalismo Urbano"],
  },

  // ── ESCENCIA ───────────────────────────────────────────────
  {
    id: "esc-corazon-sagrado",
    sku: "MA-ESC-001",
    name: "Medalla Corazón Sagrado",
    description: "Inspirada en los milagritos tradicionales mexicanos, esta pieza simboliza el amor incondicional y la devoción.",
    price: 4500,
    currency: "MXN",
    category: "Collares",
    collection: "Escencia",
    images: [
      cdn(CLD.escencia.s54),
      cdn(CLD.escencia.cloud),
      cdn(CLD.escencia.m10),
    ],
    materials: ["Oro 14k", "Rubíes"],
    stock: 2,
    featured: true,
    significado: "El corazón es el centro de la esencia humana, el milagrito es la petición y el agradecimiento hecho arte.",
    occasions: ["Protección", "Ceremonia"],
    outfits: ["Escote en V", "Vestido de Encaje"],
  },
  {
    id: "esc-aretes-milagrito",
    sku: "MA-ESC-002",
    name: "Aretes Milagrito Gota",
    description: "Pequeñas exvotos esculpidos en plata con detalles en oro, piezas cargadas de misticismo.",
    price: 3200,
    currency: "MXN",
    category: "Pendientes",
    collection: "Escencia",
    images: [
      cdn(CLD.escencia.s59),
      cdn(CLD.escencia.s62),
    ],
    materials: ["Plata .925", "Detalles en Oro 14k"],
    stock: 4,
    significado: "Recordatorios constantes de los pequeños milagros cotidianos.",
    occasions: ["Evento Social", "Regalo de Sentido"],
    outfits: ["Look Monocromático"],
  },

  // ── DISEÑOS DE AUTOR / INDIVIDUALES ───────────────────────
  {
    id: "ind-semilla-mar",
    sku: "MA-IND-001",
    name: "Aretes Semilla de Mar",
    description: "Diseño de autor inspirado en las formas orgánicas de las conchas marinas encontradas en las costas de Guerrero.",
    price: 8500,
    currency: "MXN",
    category: "Pendientes",
    collection: "Diseños de Autor",
    images: [
      cdn(CLD.individuales.mine30),
      cdn(CLD.individuales.mine51),
      cdn(CLD.individuales.mine32),
      cdn(CLD.individuales.mine36),
    ],
    materials: ["Oro Amarillo 18k", "Texturizado a mano"],
    stock: 1,
    featured: true,
    significado: "La semilla como origen de la vida, protegida por el mar. Una pieza que celebra la fertilidad creativa.",
    metadata: { isAuthorDesign: true, style: "Escultórico" },
  },
  {
    id: "ind-perla-roca",
    sku: "MA-IND-002",
    name: "Anillo Perla de Roca",
    description: "Pieza única. Una perla negra de gran formato montada sobre una estructura de plata que emula la roca volcánica.",
    price: 12000,
    currency: "MXN",
    category: "Piezas Únicas",
    collection: "Piezas Únicas",
    images: [
      cdn(CLD.individuales.mine52),
      cdn(CLD.individuales.m25),
    ],
    materials: ["Plata Ley .950", "Perla Negra de Tahití"],
    stock: 1,
    featured: true,
    significado: "La belleza que nace del caos. La perla perfecta custodiada por la imperfección de la roca.",
    metadata: { style: "Orgánico Brutalista" },
  },

  // ── ETÉREA ─────────────────────────────────────────────────
  {
    id: "ete-set-vuelo",
    sku: "MA-ETE-001",
    name: "Set Vuelo Etéreo",
    description: "Conjunto de collar y aretes con líneas que parecen levitar. Representa la libertad y la ligereza del alma.",
    price: 18900,
    currency: "MXN",
    category: "Sets",
    collection: "Etérea",
    images: [
      cdn(CLD.eterea.m2),
      cdn(CLD.eterea.m6),
      cdn(CLD.eterea.m10),
      cdn(CLD.eterea.m11),
    ],
    materials: ["Oro Blanco 14k", "Zafiros Blancos"],
    stock: 1,
    featured: true,
    significado: "Lo etéreo es aquello que pertenece al cielo. Estas piezas buscan elevar la vibración de quien las porta.",
  },
  {
    id: "ete-pulsera-brisa",
    sku: "MA-ETE-002",
    name: "Pulsera Brisa",
    description: "Pulsera rígida de apertura invisible, con una textura que emula el paso del viento sobre la arena.",
    price: 9500,
    currency: "MXN",
    category: "Pulseras",
    collection: "Etérea",
    images: [
      cdn(CLD.eterea.m15),
      cdn(CLD.eterea.m16),
      cdn(CLD.eterea.m17),
    ],
    materials: ["Oro 14k"],
    stock: 3,
    significado: "Un recordatorio táctil de la impermanencia y la belleza de lo sutil.",
  },

  // ── SERPIENTES ─────────────────────────────────────────────
  {
    id: "ser-anillo-dualidad",
    sku: "MA-SER-001",
    name: "Anillo Serpiente Dualidad",
    description: "Dos cabezas de serpiente que se encuentran en el centro, representando el equilibrio entre la luz y la sombra.",
    price: 7200,
    currency: "MXN",
    category: "Anillos",
    collection: "Serpientes",
    images: [
      cdn(CLD.serpientes.s100),
      cdn(CLD.serpientes.d064),
      cdn(CLD.serpientes.s101),
    ],
    materials: ["Oro 14k", "Ojos de Esmeralda"],
    stock: 2,
    featured: true,
    significado: "La serpiente es renovación constante. La dualidad es la aceptación de nuestra totalidad.",
  },

  // ── FLORAL ─────────────────────────────────────────────────
  {
    id: "flo-anillo-dalia",
    sku: "MA-FLO-001",
    name: "Anillo Dalia Ancestral",
    description: "Homenaje a la flor nacional de México. Pétalos esculpidos con una precisión que desafía al metal.",
    price: 5800,
    currency: "MXN",
    category: "Anillos",
    collection: "Floral",
    images: [
      cdn(CLD.floral.f1),
      cdn(CLD.floral.c3_1),
      cdn(CLD.floral.f2),
    ],
    materials: ["Plata .925", "Centro de Citrino"],
    stock: 5,
    significado: "La Dalia representa la dignidad y la fuerza escondida en la delicadeza.",
  },

  // ── ECOS DE LA TIERRA ──────────────────────────────────────
  {
    id: "eco-anillo-tectonico",
    sku: "MA-ECO-001",
    name: "Anillo Tectónico",
    description: "Inspirado en el movimiento de las placas terrestres. Una pieza de gran volumen y presencia escultórica.",
    price: 4200,
    currency: "MXN",
    category: "Anillos",
    collection: "Ecos de la Tierra",
    images: [
      cdn(CLD.ecos.a1),
      cdn(CLD.ecos.a2),
      cdn(CLD.ecos.d317),
    ],
    materials: ["Plata .950 Envejecida"],
    stock: 4,
    significado: "La tierra siempre habla. Esta pieza es un eco de su fuerza primordial.",
  },
  {
    id: "eco-brazalete-estrato",
    sku: "MA-ECO-002",
    name: "Brazalete Estrato",
    description: "Brazalete abierto con texturas que emulan las capas de la tierra acumuladas a través de los eones.",
    price: 8900,
    currency: "MXN",
    category: "Pulseras",
    collection: "Ecos de la Tierra",
    images: [
      cdn(CLD.ecos.d318),
      cdn(CLD.ecos.d317),
    ],
    materials: ["Plata Ley .950"],
    stock: 2,
    significado: "Nuestra historia está escrita en los estratos del tiempo. Portar esta pieza es portar memoria.",
  },

  // ── ANILLOS DE PIEDRAS ─────────────────────────────────────
  {
    id: "pie-anillo-ritual",
    sku: "MA-PIE-001",
    name: "Anillo Ritual de Cristal",
    description: "Anillo de gran formato con un cuarzo maestro en bruto. La piedra dicta la forma del metal.",
    price: 11500,
    currency: "MXN",
    category: "Piezas Únicas",
    collection: "Anillos de Piedras",
    images: [
      cdn(CLD.piedras.s4),
      cdn(CLD.piedras.s7),
      cdn(CLD.piedras.s5),
    ],
    materials: ["Plata .925", "Cuarzo Hialino"],
    stock: 1,
    significado: "Una pieza para canalizar energía. El cristal es el guardián de la luz.",
  },
];
