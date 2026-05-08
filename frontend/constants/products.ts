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

export const PRODUCTS: Product[] = [
  // AMATISTA
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
      "/assets/products/amatista/Colección 1_4.jpg",
      "/assets/products/amatista/Colección 1_5.jpg",
      "/assets/products/amatista/Colección 1_1.jpg",
      "/assets/products/amatista/Colección 1_2.jpg"
    ],
    materials: ["Plata .925", "Amatista Natural"],
    stock: 5,
    featured: true,
    significado: "La amatista es la piedra de la sabiduría y la transmutación, permitiendo que el portador conecte con su paz interior.",
    occasions: ["Gala", "Ritual", "Meditación"],
    outfits: ["Seda Cruda", "Lino Blanco"]
  },

  // CHAI (Multiple Products)
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
      "/assets/products/chai/CHAI.JPG",
      "/assets/products/chai/CHAI-2.JPG",
      "/assets/products/chai/CHAI-21.JPG",
      "/assets/products/chai/CHAI-18.JPG"
    ],
    materials: ["Plata .925", "Baño de Oro 24k"],
    stock: 3,
    featured: true,
    significado: "El Chai representa el número 18, el valor numérico de la 'Vida'. Portarlo es celebrar el flujo constante del ser.",
    occasions: ["Celebración", "Legado"],
    outfits: ["Vestido de Gala", "Cuello Alto"]
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
      "/assets/products/chai/CHAI-4.JPG",
      "/assets/products/chai/CHAI-5.JPG",
      "/assets/products/chai/CHAI-6.JPG"
    ],
    materials: ["Plata .925"],
    stock: 8,
    significado: "Representa la capacidad de adaptarse y fluir con los ciclos de la naturaleza.",
    occasions: ["Cotidiano Elegante"],
    outfits: ["Minimalismo Urbano"]
  },

  // ESCENCIA (Milagritos)
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
      "/assets/products/escencia/SMA_MINERVA-54.JPG",
      "/assets/products/escencia/joyería-2.JPG",
      "/assets/products/escencia/Minerva_Joyeria_1_-10.JPG"
    ],
    materials: ["Oro 14k", "Rubíes"],
    stock: 2,
    featured: true,
    significado: "El corazón es el centro de la esencia humana, el milagrito es la petición y el agradecimiento hecho arte.",
    occasions: ["Protección", "Ceremonia"],
    outfits: ["Escote en V", "Vestido de Encaje"]
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
      "/assets/products/escencia/SMA_MINERVA-59.JPG",
      "/assets/products/escencia/SMA_MINERVA-62.JPG"
    ],
    materials: ["Plata .925", "Detalles en Oro 14k"],
    stock: 4,
    significado: "Recordatorios constantes de los pequeños milagros cotidianos.",
    occasions: ["Evento Social", "Regalo de Sentido"],
    outfits: ["Look Monocromático"]
  },

  // INDIVIDUALES (Diseños de Autor & Piezas Únicas)
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
      "/assets/products/individuales/MINE-30.JPG",
      "/assets/products/individuales/MINE-51.JPG",
      "/assets/products/individuales/MINE-32.JPG",
      "/assets/products/individuales/MINE-36.JPG"
    ],
    materials: ["Oro Amarillo 18k", "Texturizado a mano"],
    stock: 1,
    featured: true,
    significado: "La semilla como origen de la vida, protegida por el mar. Una pieza que celebra la fertilidad creativa.",
    metadata: { isAuthorDesign: true, style: "Escultórico" }
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
      "/assets/products/individuales/MINE-52.jpg",
      "/assets/products/individuales/Minerva2-25.jpg"
    ],
    materials: ["Plata Ley .950", "Perla Negra de Tahití"],
    stock: 1,
    featured: true,
    significado: "La belleza que nace del caos. La perla perfecta custodiada por la imperfección de la roca.",
    metadata: { style: "Orgánico Brutalista" }
  },

  // ETÉREA (Large Collection)
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
      "/assets/products/eterea/Minerva2-2.JPG",
      "/assets/products/eterea/Minerva2-6.JPG",
      "/assets/products/eterea/Minerva2-10.JPG",
      "/assets/products/eterea/Minerva2-11.JPG"
    ],
    materials: ["Oro Blanco 14k", "Zafiros Blancos"],
    stock: 1,
    featured: true,
    significado: "Lo etéreo es aquello que pertenece al cielo. Estas piezas buscan elevar la vibración de quien las porta."
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
      "/assets/products/eterea/Minerva 2-15.jpg",
      "/assets/products/eterea/Minerva 2-16.jpg",
      "/assets/products/eterea/Minerva 2-17.jpg"
    ],
    materials: ["Oro 14k"],
    stock: 3,
    significado: "Un recordatorio táctil de la impermanencia y la belleza de lo sutil."
  },

  // SERPIENTES
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
      "/assets/products/serpientes/SMA_MINERVA-100.JPG",
      "/assets/products/serpientes/DSCF5064.JPG",
      "/assets/products/serpientes/SMA_MINERVA-101 (1).JPG"
    ],
    materials: ["Oro 14k", "Ojos de Esmeralda"],
    stock: 2,
    featured: true,
    significado: "La serpiente es renovación constante. La dualidad es la aceptación de nuestra totalidad."
  },

  // FLORAL
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
      "/assets/products/floral/FLORES 1.jpg",
      "/assets/products/floral/Colección 3_1.jpg",
      "/assets/products/floral/FLORES 2.jpg"
    ],
    materials: ["Plata .925", "Centro de Citrino"],
    stock: 5,
    significado: "La Dalia representa la dignidad y la fuerza escondida en la delicadeza."
  },

  // ECOS DE LA TIERRA
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
      "/assets/products/ecos-tierra/ANILLO 1.jpg",
      "/assets/products/ecos-tierra/DSCF4196 (1).JPG",
      "/assets/products/ecos-tierra/ANILLO 2.jpg"
    ],
    materials: ["Plata .950 Envejecida"],
    stock: 4,
    significado: "La tierra siempre habla. Esta pieza es un eco de su fuerza primordial."
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
      "/assets/products/ecos-tierra/DSCF4318.JPG",
      "/assets/products/ecos-tierra/DSCF4317.JPG"
    ],
    materials: ["Plata Ley .950"],
    stock: 2,
    significado: "Nuestra historia está escrita en los estratos del tiempo. Portar esta pieza es portar memoria."
  },

  // ANILLOS DE PIEDRAS
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
      "/assets/products/anillos-piedras/SMA_MINERVA-4.JPG",
      "/assets/products/anillos-piedras/SMA_MINERVA-7.JPG",
      "/assets/products/anillos-piedras/SMA_MINERVA-5.JPG"
    ],
    materials: ["Plata .925", "Cuarzo Hialino"],
    stock: 1,
    significado: "Una pieza para canalizar energía. El cristal es el guardián de la luz."
  }
];
