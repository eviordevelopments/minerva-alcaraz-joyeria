-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 03: Product Seed Data — All Products
-- ============================================================
-- Run AFTER 02_products_and_collections.sql
-- This inserts all products from the frontend constants

-- ============================================================
-- SEED: All Products
-- ============================================================

-- Helper: get collection id by slug
-- We insert products with collection_id references

INSERT INTO public.products (
  sku, slug, name, description, significado, price_cents, currency,
  category, collection_name, materials, primary_material, purity, gender,
  is_featured, is_active, stock, images, primary_image
)
SELECT
  p.sku, p.slug, p.name, p.description, p.significado, p.price_cents,
  'MXN'::currency_code,
  p.category::product_category,
  p.collection_name, p.materials, p.primary_material, p.purity,
  'Unisex'::product_gender,
  p.is_featured, TRUE, p.stock, p.images, p.primary_image
FROM (
  VALUES

  -- ===================== AMATISTA =====================
  ('MA-AMA-001', 'anillo-amatista-de-luz', 'Anillo Amatista de Luz',
   'Una pieza que captura la esencia de la transmutación. Amatista tallada a mano con montura en plata .925 envejecida.',
   'La amatista es la piedra de la sabiduría y la transmutación, permitiendo que el portador conecte con su paz interior.',
   380000, 'Anillos', 'Amatista',
   ARRAY['Plata .925', 'Amatista Natural'],
   'Plata .925', '.925', TRUE, 5,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280176/minerva_joyeria/products/amatista/Coleccio_n_1_4.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280177/minerva_joyeria/products/amatista/Coleccio_n_1_5.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280174/minerva_joyeria/products/amatista/Coleccio_n_1_1.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280175/minerva_joyeria/products/amatista/Coleccio_n_1_2.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280176/minerva_joyeria/products/amatista/Coleccio_n_1_4.jpg'),

  -- ===================== CHAI =====================
  ('MA-CHA-001', 'medallon-chai-ancestral', 'Medallón Chai Ancestral',
   'Símbolo de vida y protección. Un medallón de gran formato con detalles cincelados a mano.',
   'El Chai representa el número 18, el valor numérico de la Vida. Portarlo es celebrar el flujo constante del ser.',
   520000, 'Collares', 'Chai',
   ARRAY['Plata .925', 'Baño de Oro 24k'],
   'Plata .925', '.925', TRUE, 3,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275655/minerva_joyeria/products/chai/CHAI.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275629/minerva_joyeria/products/chai/CHAI-2.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275631/minerva_joyeria/products/chai/CHAI-21.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275627/minerva_joyeria/products/chai/CHAI-18.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275655/minerva_joyeria/products/chai/CHAI.jpg'),

  ('MA-CHA-002', 'anillo-chai-fluidez', 'Anillo Chai Fluidez',
   'Anillo de banda ancha con grabados rítmicos que evocan el movimiento del agua y el tiempo.',
   'Representa la capacidad de adaptarse y fluir con los ciclos de la naturaleza.',
   290000, 'Anillos', 'Chai',
   ARRAY['Plata .925'],
   'Plata .925', '.925', FALSE, 8,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275646/minerva_joyeria/products/chai/CHAI-4.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275648/minerva_joyeria/products/chai/CHAI-5.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275649/minerva_joyeria/products/chai/CHAI-6.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275646/minerva_joyeria/products/chai/CHAI-4.jpg'),

  -- ===================== ESCENCIA =====================
  ('MA-ESC-001', 'medalla-corazon-sagrado', 'Medalla Corazón Sagrado',
   'Inspirada en los milagritos tradicionales mexicanos, esta pieza simboliza el amor incondicional y la devoción.',
   'El corazón es el centro de la esencia humana, el milagrito es la petición y el agradecimiento hecho arte.',
   450000, 'Collares', 'Escencia',
   ARRAY['Oro 14k', 'Rubíes'],
   'Oro 14k', '14k', TRUE, 2,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275673/minerva_joyeria/products/escencia/SMA_MINERVA-54.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778279752/minerva_joyeria/products/escencia/s5lcje72gpht7y1eh2nw.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275666/minerva_joyeria/products/escencia/Minerva_Joyeria_1_-10.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275673/minerva_joyeria/products/escencia/SMA_MINERVA-54.jpg'),

  ('MA-ESC-002', 'aretes-milagrito-gota', 'Aretes Milagrito Gota',
   'Pequeñas exvotos esculpidos en plata con detalles en oro, piezas cargadas de misticismo.',
   'Recordatorios constantes de los pequeños milagros cotidianos.',
   320000, 'Pendientes', 'Escencia',
   ARRAY['Plata .925', 'Detalles en Oro 14k'],
   'Plata .925', '.925', FALSE, 4,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275674/minerva_joyeria/products/escencia/SMA_MINERVA-59.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275675/minerva_joyeria/products/escencia/SMA_MINERVA-62.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275674/minerva_joyeria/products/escencia/SMA_MINERVA-59.jpg'),

  -- ===================== DISEÑOS DE AUTOR =====================
  ('MA-IND-001', 'aretes-semilla-de-mar', 'Aretes Semilla de Mar',
   'Diseño de autor inspirado en las formas orgánicas de las conchas marinas encontradas en las costas de Guerrero.',
   'La semilla como origen de la vida, protegida por el mar. Una pieza que celebra la fertilidad creativa.',
   850000, 'Pendientes', 'Diseños de Autor',
   ARRAY['Oro Amarillo 18k', 'Texturizado a mano'],
   'Oro Amarillo 18k', '18k', TRUE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-30.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-51.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-32.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-36.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-30.JPG'),

  -- ===================== PIEZAS ÚNICAS =====================
  ('MA-IND-002', 'anillo-perla-de-roca', 'Anillo Perla de Roca',
   'Pieza única. Una perla negra de gran formato montada sobre una estructura de plata que emula la roca volcánica.',
   'La belleza que nace del caos. La perla perfecta custodiada por la imperfección de la roca.',
   1200000, 'Piezas Únicas', 'Piezas Únicas',
   ARRAY['Plata Ley .950', 'Perla Negra de Tahití'],
   'Plata Ley .950', '.950', TRUE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-52.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/Minerva2-25.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-52.jpg'),

  -- ===================== ETÉREA =====================
  ('MA-ETE-001', 'set-vuelo-etereo', 'Set Vuelo Etéreo',
   'Conjunto de collar y aretes con líneas que parecen levitar. Representa la libertad y la ligereza del alma.',
   'Lo etéreo es aquello que pertenece al cielo. Estas piezas buscan elevar la vibración de quien las porta.',
   1890000, 'Sets', 'Etérea',
   ARRAY['Oro Blanco 14k', 'Zafiros Blancos'],
   'Oro Blanco 14k', '14k', TRUE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-2.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-6.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-10.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-11.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-2.JPG'),

  ('MA-ETE-002', 'pulsera-brisa', 'Pulsera Brisa',
   'Pulsera rígida de apertura invisible, con una textura que emula el paso del viento sobre la arena.',
   'Un recordatorio táctil de la impermanencia y la belleza de lo sutil.',
   950000, 'Pulseras', 'Etérea',
   ARRAY['Oro 14k'],
   'Oro 14k', '14k', FALSE, 3,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-15.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-16.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-17.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-15.jpg'),

  -- ===================== SERPIENTES =====================
  ('MA-SER-001', 'anillo-serpiente-dualidad', 'Anillo Serpiente Dualidad',
   'Dos cabezas de serpiente que se encuentran en el centro, representando el equilibrio entre la luz y la sombra.',
   'La serpiente es renovación constante. La dualidad es la aceptación de nuestra totalidad.',
   720000, 'Anillos', 'Serpientes',
   ARRAY['Oro 14k', 'Ojos de Esmeralda'],
   'Oro 14k', '14k', TRUE, 2,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280294/minerva_joyeria/products/serpientes/DSCF5064.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-101_1.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg'),

  -- ===================== FLORAL =====================
  ('MA-FLO-001', 'anillo-dalia-ancestral', 'Anillo Dalia Ancestral',
   'Homenaje a la flor nacional de México. Pétalos esculpidos con una precisión que desafía al metal.',
   'La Dalia representa la dignidad y la fuerza escondida en la delicadeza.',
   580000, 'Anillos', 'Floral',
   ARRAY['Plata .925', 'Centro de Citrino'],
   'Plata .925', '.925', FALSE, 5,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280281/minerva_joyeria/products/floral/FLORES_1.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280269/minerva_joyeria/products/floral/Coleccio_n_3_1.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280282/minerva_joyeria/products/floral/FLORES_2.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280281/minerva_joyeria/products/floral/FLORES_1.jpg'),

  -- ===================== ECOS DE LA TIERRA =====================
  ('MA-ECO-001', 'anillo-tectonico', 'Anillo Tectónico',
   'Inspirado en el movimiento de las placas terrestres. Una pieza de gran volumen y presencia escultórica.',
   'La tierra siempre habla. Esta pieza es un eco de su fuerza primordial.',
   420000, 'Anillos', 'Ecos de la Tierra',
   ARRAY['Plata .950 Envejecida'],
   'Plata .950 Envejecida', '.950', FALSE, 4,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/ANILLO%201.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4196%20(1).JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/ANILLO%202.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/ANILLO%201.jpg'),

  ('MA-ECO-002', 'brazalete-estrato', 'Brazalete Estrato',
   'Brazalete abierto con texturas que emulan las capas de la tierra acumuladas a través de los eones.',
   'Nuestra historia está escrita en los estratos del tiempo. Portar esta pieza es portar memoria.',
   890000, 'Pulseras', 'Ecos de la Tierra',
   ARRAY['Plata Ley .950'],
   'Plata Ley .950', '.950', FALSE, 2,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4318.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4317.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4318.JPG'),

  -- ===================== ANILLOS DE PIEDRAS =====================
  ('MA-PIE-001', 'anillo-ritual-de-cristal', 'Anillo Ritual de Cristal',
   'Anillo de gran formato con un cuarzo maestro en bruto. La piedra dicta la forma del metal.',
   'Una pieza para canalizar energía. El cristal es el guardián de la luz.',
   1150000, 'Piezas Únicas', 'Anillos de Piedras',
   ARRAY['Plata .925', 'Cuarzo Hialino'],
   'Plata .925', '.925', FALSE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-4.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-7.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-5.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-4.JPG')

) AS p(
  sku, slug, name, description, significado, price_cents, category, collection_name,
  materials, primary_material, purity, is_featured, stock, images, primary_image
)
ON CONFLICT (sku) DO NOTHING;

-- ============================================================
-- UPDATE: Link products to collection IDs
-- ============================================================
UPDATE public.products p
SET collection_id = c.id
FROM public.collections c
WHERE p.collection_name = c.name;

-- Update unique piece flags
UPDATE public.products
SET is_unique_piece = TRUE, is_limited_edition = TRUE
WHERE category = 'Piezas Únicas' OR stock = 1;

-- Update author design flag
UPDATE public.products
SET is_author_design = TRUE
WHERE collection_name = 'Diseños de Autor';
