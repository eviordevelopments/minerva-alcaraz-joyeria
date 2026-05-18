Plano de Arquitectura de Sistemas y Diseño Funcional del ERP para Minerva Alcaraz JoyeríaLa digitalización operativa de Minerva Alcaraz Joyería exige una infraestructura que unifique la sofisticación estética de una marca de ultra-lujo con la robustez técnica de un sistema de planificación de recursos empresariales (ERP). Bajo la filosofía de Lean Engineering y el Pensamiento de Sistemas, el presente reporte técnico detalla la arquitectura de software diseñada para operar con un costo de inversión de capital inicial nulo ($\text{CAPEX} = 0$), utilizando un stack tecnológico moderno cimentado en Supabase, Cloudinary y Next.js. Este ecosistema permite mantener la integridad transaccional de piezas únicas y colecciones exclusivas, automatizar el flujo de ingesta de archivos multimedia en alta resolución y coordinar de forma asíncrona la logística de valores y la agenda del showroom privado.Arquitectura de Red y Enrutamiento MultidominioLa coexistencia del portal público de comercio electrónico (www.minervaalcarazjoyeria.mx) y el sistema de gestión interna (admin.minervaalcarazjoyeria.mx) se resuelve a través de un único repositorio de código bajo un esquema de monorepo con rutas segmentadas. Esta topología evita la duplicación de esquemas de datos y la sobrecarga de dependencias, reduciendo los costos de mantenimiento y acelerando el ciclo de despliegue continuo en la nube perimetral de Vercel.El enrutador centralizado de Next.js utiliza carpetas agrupadas lógicamente para separar los contextos de ejecución. La carpeta (public) encapsula la interfaz de cara al cliente con un diseño ligero y optimizado para la conversión, mientras que la carpeta (admin) restringe el acceso al personal del taller mediante políticas estrictas de control de acceso y un diseño visual especializado para la administración de inventarios de lujo.Estructura de Directorios del MonorepoLa organización física del proyecto permite un desacoplamiento lógico limpio, compartiendo de manera directa las utilidades de conexión a bases de datos y transformaciones multimedia :Plaintextminerva-alcaraz-platform/
├──.github/                  --> Configuración de despliegue automático y CI/CD
├── src/
│   ├── app/                  --> Enrutador central de Next.js
│   │   ├── (public)/         --> Portal de comercio electrónico (Alta Joyería)
│   │   │   ├── layout.tsx    --> Encabezado institucional, Bluter Stencil y Raleway
│   │   │   ├── page.tsx      --> Portada de la marca y video del Atelier
│   │   │   ├── joyas/        --> Ficha de producto (PDP) con efecto Hover Flip
│   │   │   └── circle/       --> Acceso y catálogo de miembros de "The Circle"
│   │   │
│   │   └── (admin)/          --> Capa del negocio (ERP Interno)
│   │       ├── layout.tsx    --> Panel oscuro con paleta Bosque Profundo y Oro Antiguo
│   │       ├── dashboard/    --> Gráficas de conversión, visitas y carritos abandonados
│   │       ├── inventario/   --> Gestión de stock, serialización y etiquetas de búsqueda
│   │       ├── concierge/    --> Seguimiento de pedidos personalizados y estatus logístico
│   │       └── showroom/     --> Agenda de citas físicas y asignación de mesas en el Atelier
│   │
│   ├── components/           --> Componentes de interfaz de usuario (botones, modales)
│   └── lib/
│       ├── supabase.ts       --> Cliente único de conexión a la base de datos Supabase
│       └── cloudinary.ts     --> Utilidades para optimización dinámica de imágenes
El rendimiento del navegador del cliente final se optimiza mediante la separación automática del código (Code Splitting). Un comprador que navega por el catálogo público solo descarga el paquete de scripts correspondiente a la tienda en línea, aislando las dependencias pesadas del ERP administrativo para su descarga exclusiva tras el inicio de sesión del personal de operaciones.Implementación del Middleware de Enrutamiento DinámicoPara mapear de forma transparente los subdominios sin alterar la dirección visible en el navegador de los usuarios ni generar problemas de uso compartido de recursos de origen cruzado (CORS), se implementa un middleware de Next.js en la raíz del proyecto. Este script intercepta cada solicitud entrante antes de que llegue al servidor de renderizado, analiza el host de origen y reescribe internamente la ruta hacia el grupo de páginas correspondiente :TypeScript// middleware.ts - Ubicado en la raíz del proyecto
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher:,
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':').toLowerCase();

  // Definición de los dominios del sistema para producción y entornos locales
  const adminHost = 'admin.minervaalcarazjoyeria.mx';
  const localAdminHost = 'admin.localhost';

  if (hostname === adminHost || hostname === localAdminHost) {
    // Reescritura interna hacia la carpeta del ERP administrativo
    url.pathname = `/(admin)${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Reescritura interna hacia el portal de ventas públicas por defecto
  url.pathname = `/(public)${url.pathname}`;
  return NextResponse.rewrite(url);
}
Modelo de Datos Relacional y Estrategia de SerializaciónLa base de datos de Minerva Alcaraz Joyería utiliza la potencia relacional de PostgreSQL a través de Supabase para modelar con precisión las interacciones entre los productos, los materiales nobles, el inventario serializado, los eventos analíticos del embudo de conversión y el calendario del showroom. La serialización es indispensable para identificar unívocamente cada pieza de ultra-lujo y mitigar riesgos de duplicación de registros en bodega.Estructura de Clave de Serialización InteligenteEl número de serie único global (SKU) se genera algorítmicamente mediante la unión de metadatos estructurales de la pieza física, siguiendo un patrón estricto de identificación:$$\text{SKU} = \text{MA} \mathbin{\Vert} \text{TIPO} \mathbin{\Vert} \text{COLECCIÓN} \mathbin{\Vert} \text{MATERIAL} \mathbin{\Vert} \text{PREFERENCIA} \mathbin{\Vert} \text{CORRELATIVO}$$Esta ecuación se traduce en códigos legibles y estructurados que facilitan el control de stock, la búsqueda rápida en el ERP y el embalaje seguro de las piezas. Un ejemplo práctico para un Anillo Único de la colección Etérea en Oro de 14k se desglosa en la siguiente estructura:MA: Prefijo de marca inalterable (Minerva Alcaraz).AN: Identificador del Tipo de Joya (Anillos).ETE: Identificador de la Colección (Etérea).O14: Identificador del Material Principal (Oro 14k).PUN: Identificador de la Preferencia de Edición (Piezas Únicas).0001: Número correlativo consecutivo secuencial para cada lote o pieza individual.Esquema Físico de Base de Datos (Código de Migración SQL)Este script SQL configura de forma estricta los tipos enumerados de la marca, las tablas maestras, las relaciones muchos a muchos de los materiales de cada joya, y el inventario de piezas serializadas :SQL-- 1. TIPOS ENUMERADOS (Taxonomías Exactas de la Marca)
CREATE TYPE tipo_joya AS ENUM (
    'Anillos', 'Collares', 'Pendientes', 'Piezas Únicas', 'Sets', 'Pulseras', 'Colecciones'
);

CREATE TYPE coleccion_joya AS ENUM (
    'Amatista', 'Chai', 'Escencia', 'Diseños de Autor', 'Piezas Únicas', 
    'Etérea', 'Serpientes', 'Floral', 'Ecos de la Tierra', 'Anillos de Piedras'
);

CREATE TYPE material_joya AS ENUM (
    'Plata.925', 'Amatista Natural', 'Baño de Oro 24k', 'Oro 14k', 'Rubíes', 
    'Detalles en Oro 14k', 'Oro Amarillo 18k', 'Texturizado a mano', 'Plata Ley.950', 
    'Perla Negra de Tahití', 'Oro Blanco 14k', 'Zafiros Blancos', 'Ojos de Esmeralda', 
    'Centro de Citrino', 'Plata.950 Envejecida', 'Cuarzo Hialino'
);

CREATE TYPE preferencia_joya AS ENUM (
    'Piezas Únicas', 'Edición Limitada', 'Diseño de Autor'
);

CREATE TYPE status_pedido AS ENUM (
    'Recibido', 'En preparación', 'Elaboración', 'Enviando', 'Entregado', 'Devuelto'
);

-- 2. TABLA MAESTRA DE PRODUCTOS (Definición Estructural)
CREATE TABLE public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL CHECK (precio >= 0),
    tipo tipo_joya NOT NULL,
    coleccion coleccion_joya NOT NULL,
    preferencia preferencia_joya NOT NULL,
    narrativa_emocional TEXT NOT NULL,
    detalles_tecnicos TEXT NOT NULL,
    caracteristicas_json JSONB DEFAULT '{"tallas":, "colores":}'::JSONB,
    sugeridos UUID DEFAULT '{}',
    disponible BOOLEAN DEFAULT TRUE,
    is_exclusive_circle BOOLEAN DEFAULT FALSE,
    seo_keywords VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. TABLA DE MATERIALES POR PRODUCTO (Relación Muchos a Muchos)
CREATE TABLE public.producto_materiales (
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    material material_joya NOT NULL,
    PRIMARY KEY (producto_id, material)
);

-- 4. TABLA DE IMÁGENES (Vínculo Directo a Cloudinary con tags de optimización)
CREATE TABLE public.producto_imagenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    cloudinary_url TEXT NOT NULL,
    is_cover BOOLEAN DEFAULT FALSE,
    is_packaging BOOLEAN DEFAULT FALSE,
    hover_lifestyle_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. TABLA DE STOCK SERIALIZADO (Trazabilidad Física Individual)
CREATE TABLE public.inventario_serializado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE RESTRICT,
    numero_serie_unico VARCHAR(100) UNIQUE NOT NULL, -- SKU-0001
    disponible BOOLEAN DEFAULT TRUE NOT NULL,
    ubicacion_fisica VARCHAR(100) DEFAULT 'Atelier Principal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. TABLA DE CAPTURA DE INTERACCIONES (Embudo de Conversión)
CREATE TABLE public.eventos_analiticas (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tipo_evento VARCHAR(50) NOT NULL, -- 'vista_producto', 'add_to_cart', 'init_checkout', 'purchase'
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    metadatos JSONB DEFAULT '{}'::JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. TABLA DE CAPTURA PARA CRM (Suscripción a Newsletter)
CREATE TABLE public.newsletter_suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. TABLA DE RECURSOS DE SHOWROOM (Mesas de Atención y Cubículos)
CREATE TABLE public.recursos_showroom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_recurso VARCHAR(100) NOT NULL, -- 'Mesa Principal de Diamantes', 'Cubículo Privado 1'
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. TABLA DE CITAS EN EL ATELIER (Sincronización Bidireccional)
CREATE TABLE public.citas_showroom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recurso_id UUID REFERENCES public.recursos_showroom(id) ON DELETE RESTRICT,
    duracion_cita TSTZRANGE NOT NULL, -- Rango estricto de fecha/hora de inicio y fin
    motivo_visita VARCHAR(255) NOT NULL, -- 'Diseño a medida', 'Visualización de colección'
    estatus_cita VARCHAR(50) DEFAULT 'Pendiente de confirmación', -- 'Confirmada', 'Completada', 'Cancelada'
    notas_asesor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. TABLA DE PEDIDOS PERSONALIZADOS (Concierge y Producción Artesanal)
CREATE TABLE public.pedidos_personalizados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    sku_serializado VARCHAR(100) NOT NULL,
    monto_total DECIMAL(12, 2) NOT NULL,
    status_proceso status_pedido DEFAULT 'Recibido' NOT NULL,
    detalles_personalizacion JSONB NOT NULL, -- Talla específica, grabado de texto, gema seleccionada
    tiempo_estimado_entrega DATE,
    notas_artesano TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- INDEXACIÓN CLAVE PARA RENDIMIENTO EN POLÍTICAS RLS AND FILTRADOS
CREATE INDEX idx_productos_sku ON public.productos(sku);
CREATE INDEX idx_productos_exclusive ON public.productos(is_exclusive_circle);
CREATE INDEX idx_inventario_serial_prod ON public.inventario_serializado(producto_id);
CREATE INDEX idx_citas_showroom_duracion ON public.citas_showroom USING GIST (duracion_cita);
CREATE INDEX idx_eventos_analiticas_tipo ON public.eventos_analiticas(tipo_evento, timestamp);
Protocolo de Ingesta Atómica Automatizada y Firma SeguraEl panel de administración interna ERP interactúa directamente con Cloudinary mediante un protocolo de subida delegada y firma criptográfica segura, lo que elimina la necesidad de procesar los pesados binarios de imágenes de alta resolución a través de los servidores de Supabase, evitando latencias y optimizando los recursos del sistema.La subida se realiza directamente desde el navegador del administrador hacia los servidores de almacenamiento de Cloudinary una vez autorizada la solicitud por una Supabase Edge Function. Este flujo protege el secreto de la clave de la API maestra (API Secret) de la marca y organiza de forma jerárquica el almacenamiento de medios.Flujo Jerárquico de Ingesta y AlmacenamientoEl flujo se ejecuta bajo un esquema de pasos asíncronos que aseguran que el sitio público refleje de manera inmediata las actualizaciones gracias al canal de eventos en tiempo real :Solicitud de Firma Criptográfica: El panel de administración ERP envía los metadatos de la carga (carpeta destino y marca de tiempo) a una Supabase Edge Function, autenticándose con el token JWT del administrador.Generación de Firma Segura: La Edge Function recibe los parámetros, los ordena alfabéticamente y calcula un hash HMAC-SHA1 utilizando la clave privada de Cloudinary guardada de forma segura en las variables de entorno de Supabase.Subida Directa desde Cliente: El ERP recibe la firma temporal y envía el archivo binario directamente a Cloudinary, especificando la ruta estructurada: minerva_joyeria/productos///.Optimización Inteligente: Cloudinary procesa la imagen y expone la URL optimizada lista para su entrega perimetral a través de la CDN, inyectando de forma automática los tags de compresión adaptativa f_auto,q_auto.Transacción SQL Atómica: El ERP consolida en una sola operación de base de datos la información técnica del producto, la narrativa emocional, el SEO autogenerado y la URL segura de Cloudinary en la tabla correspondiente.Sincronización en Tiempo Real: Supabase detecta la inserción y notifica instantáneamente a los clientes conectados a través del canal en tiempo real, actualizando la ficha de producto (PDP) sin recargas de página.Firma de Parámetros en Supabase Edge Function (/supabase/functions/sign-cloudinary/index.ts)Este código, compatible con el entorno de ejecución Deno, valida el contexto del usuario autenticado y genera la firma digital para autorizar la transacción multimedia :TypeScriptimport { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validar autenticación del usuario administrador [19]
    const authHeader = req.headers.get('Authorization');
    if (!authHeader ||!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Falta encabezado de autorización' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const body = await req.json();
    const { paramsToSign } = body; // Ej: { folder: "minerva_joyeria/productos/Anillos/MA-AN-001", timestamp: 1315060510 }

    if (!paramsToSign) {
      return new Response(JSON.stringify({ error: 'Parámetros no proporcionados' }), { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const cloudinarySecret = Deno.env.get('CLOUDINARY_API_SECRET');
    if (!cloudinarySecret) {
      return new Response(JSON.stringify({ error: 'Configuración de servidor incompleta' }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Ordenar parámetros alfabéticamente para construir la firma [15]
    const sortedKeys = Object.keys(paramsToSign).sort();
    const parameterString = sortedKeys
     .map((key) => `${key}=${paramsToSign[key]}`)
     .join('&');

    // Generar hash SHA-1 concatenando los parámetros y la clave secreta sin separadores [15]
    const rawStringToSign = parameterString + cloudinarySecret;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawStringToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    
    // Convertir el buffer a representación hexadecimal [15]
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return new Response(JSON.stringify({ signature }), {
      status: 200,
      headers: {...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
Logística de Valores y Flujo de Procesamiento HíbridoPara asegurar la viabilidad económica y mitigar los riesgos asociados con el traslado de piezas de alto valor en México, el backend evalúa el monto total del carrito de compra de forma asíncrona. El umbral financiero crítico se establece en $5000.00 \text{ MXN}$.Las compras que no superen este valor se procesan bajo un flujo de mensajería tradicional, mientras que aquellas que lo rebasen activan un protocolo estricto de custodia de valores y atención personalizada por un asesor.Comparativa de Proveedores de Mensajería y Custodia en MéxicoLa selección de la vía logística adecuada depende directamente de la evaluación del riesgo, la cobertura y la prima de seguro de cada proveedor en territorio mexicano :Proveedor de MensajeríaLímite Máximo AsegurableCobertura en MéxicoCustodia de Valores TerrestreCosto Estimado de Seguro (Prima)FedEx Declared Value Advantage$100,000 USD (Aprox. $2,000,000 MXN) Nacional en zonas de cobertura preferencial Opcional (Kit de Cajas de Seguridad y Safe Insert de MPI) Tarifa preferencial bajo contrato corporativo recurrente Prosegur MéxicoIlimitado (Estructurado por contrato y valor de la remesa) Cobertura nacional coordinada con centros de procesamiento de efectivo Sí, camiones blindados y guardias armados dedicados en ruta Cotización dinámica en base al kilometraje de la ruta Grupo Seguridad Integral (GSI)Sin límite estricto (Servicio corporativo de custodia terrestre) Red nacional amplia con unidades blindadas de última generación Sí, custodia directa a unidades terrestres y vehículos de seguridad Contratos de cobertura anual con deducibles negociados DHL Express$100,000 MXN (Servicio estándar con seguro de envío opcional) Cobertura nacional completa en código postal ordinario No disponible en mensajería express ordinaria Prima del 1.25% del valor declarado del envío El costo total de un envío asegurado de alto valor puede modelarse matemáticamente como:$$C_{\text{envío}} = C_{\text{base}} + (V_{\text{declarado}} \times P_{\text{prima}}) + C_{\text{combustible}}$$Donde $C_{\text{base}}$ representa el costo de la tarifa de la guía estándar, $V_{\text{declarado}}$ es el costo total de la joya evaluada, $P_{\text{prima}}$ es el factor porcentual de la prima de seguro (por ejemplo, $1.25\%$ en proveedores estándar como Estafeta o DHL) y $C_{\text{combustible}}$ es el cargo variable ajustado de forma mensual.Flujo de Estados Operativos del ERP y el Ciclo de Vida del PedidoEl procesamiento artesanal y la logística de resguardo se reflejan bidireccionalmente entre el ERP del taller y la vista de perfil privado del cliente a través de un estricto control de estados de pedido:Recibido: Se dispara mediante la confirmación del webhook de pago de Stripe o tras la confirmación de una solicitud de pedido personalizado de concierge por un asesor. El inventario serializado bloquea de inmediato la pieza para evitar su doble venta.En preparación: El equipo de calidad del Atelier realiza una inspección exhaustiva de las gemas y metales preciosos con microscopio óptico. El sistema registra los números de serie de los insumos y asigna el empaque premium de seguridad con candado físico.Elaboración: Especial para los pedidos personalizados y diseños de autor a medida. En esta etapa, el backend envía una actualización de estado que muestra en el portal del cliente la leyenda: "Tu joya está siendo esculpida por manos artesanales en este momento".Enviando: El ERP genera la etiqueta de envío de alta seguridad, integrando la clave de custodia física y adjuntando la póliza de seguro sobre el valor total de la pieza. Se notifica al cliente con el código de rastreo premium.Entregado: Representa el cierre del ciclo de custodia. El mensajero requiere la firma presencial de un adulto para liberar el paquete. Una vez escaneada la entrega, el CRM activa de forma automática el protocolo post-venta de seguimiento de experiencia del cliente.Devuelto: Si el cliente ejerce su derecho de devolución, se activa un protocolo de resguardo inverso donde la pieza es custodiada de regreso al Atelier para verificar, mediante análisis gemológico, que los materiales devueltos coincidan con la pieza original.Captura de Analíticas e Infraestructura CRM de MembresíasPara maximizar el valor de vida del cliente (LTV), el ERP clasifica la base de contactos en dos listas mutuamente excluyentes desde el punto de vista del perfil de mercadeo: los Suscriptores de la Newsletter (captura básica de correo electrónico sin registro de usuario) y los Miembros de "The Circle" (perfiles de usuarios registrados con historial de compras de alto valor).Gestión del Acceso Prioritario mediante Custom Claims de SupabasePara mantener la privacidad del catálogo exclusivo de ultra-lujo y evitar la latencia asociada a realizar un cruzamiento de tablas (SQL JOIN) cada vez que un usuario consulta las colecciones exclusivas en la base de datos, se utiliza un hook de autenticación personalizado en Supabase.Este gancho inyecta el claim membership: 'the_circle' directamente dentro de la estructura criptográfica del token JWT del cliente, permitiendo que las políticas de seguridad de fila (RLS) resuelvan el acceso de forma perimetral e inmediata.┌──────────────────────────────────────┐
│  Cliente inicia sesión en la PDP     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Disparo: Auth Hook en Supabase      │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Edge function inyecta Claim:        │
│  "membership": "the_circle" en JWT   │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Navegación: Consulta productos      │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  PostgreSQL RLS valida Claim de JWT  │
│  y expone catálogo "The Circle"      │
└──────────────────────────────────────┘
El siguiente bloque de código en SQL configura el hook de autenticación encargado de leer el perfil del usuario e inyectar de manera segura el claim en su token de sesión :SQL-- Función de inyección de claims de membresía en JWT 
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  claims JSONB;
  user_membership_status text;
BEGIN
  -- Obtener el estado de membresía del usuario registrado
  SELECT membership::text INTO user_membership_status 
  FROM public.perfiles_clientes 
  WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';

  -- Si el usuario tiene una membresía asignada, inyectar el tag 
  IF user_membership_status IS NOT NULL THEN
    claims := jsonb_set(claims, '{membership}', to_jsonb(user_membership_status));
  ELSE
    claims := jsonb_set(claims, '{membership}', '"standard"');
  END IF;

  -- Sobrescribir el objeto de claims en el JWT retornado 
  event := jsonb_set(event, '{claims}', claims);
  
  RETURN event;
END;
$$;

-- Otorgar permisos y vincular la función al despachador de autenticación 
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;
Con esta infraestructura perimetral, la política de Row Level Security (RLS) en la tabla de productos limita de forma estricta la visibilidad de los artículos exclusivos, garantizando que los usuarios no autenticados o con membresía estándar no puedan ver la existencia de estas joyas, incluso si realizan llamadas manuales directamente al API :SQL-- Habilitar RLS de forma obligatoria en la tabla productos 
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Política 1: Los productos ordinarios son visibles por cualquier persona [12]
CREATE POLICY "Productos estándar visibles al público"
ON public.productos
FOR SELECT
TO anon, authenticated
USING (
    is_exclusive_circle = FALSE
);

-- Política 2: Los productos de ultra-lujo solo son visibles para miembros de The Circle [30, 31]
CREATE POLICY "Catálogo exclusivo limitado a miembros The Circle"
ON public.productos
FOR SELECT
TO authenticated
USING (
    is_exclusive_circle = TRUE 
    AND ( (SELECT auth.jwt() ->> 'membership') = 'the_circle' )
);

-- Política 3: Los administradores tienen control total sobre el inventario
CREATE POLICY "Administradores poseen control total"
ON public.productos
FOR ALL
TO authenticated
USING (
    ( (SELECT auth.jwt() ->> 'user_role') = 'admin' )
);
Planificador de Showroom Privado y Prevención de SuperposicionesEl agendamiento de visitas presenciales en el Atelier de Minerva Alcaraz Joyería requiere una experiencia fluida y sin fricciones visuales. Dos clientes de alto valor no pueden coincidir en el mismo cubículo o mesa de atención simultáneamente.Para resolver este problema con una fiabilidad matemática absoluta en el motor de base de datos, el ERP aprovecha los tipos de rango nativos de PostgreSQL (tstzrange) combinados con restricciones de exclusión indexadas por árboles de búsqueda con soporte espacial (GiST).Configuración de la Restricción de Exclusión Temporal en Base de DatosEn lugar de verificar superposiciones horarias en la capa de la aplicación (que puede dar pie a condiciones de carrera concurrentes), PostgreSQL rechaza cualquier intento de inserción o actualización de citas cuyas duraciones temporales se solapen para el mismo espacio físico asignado :SQL-- Vincular la extensión necesaria para indexación y comparación GIST
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Añadir una restricción de exclusión física a la tabla de citas 
ALTER TABLE public.citas_showroom
ADD CONSTRAINT prevent_showroom_overlap
EXCLUDE USING gist (
    recurso_id WITH =,            -- El mismo espacio físico o mesa asignada
    duracion_cita WITH &&         -- Operador de solapamiento temporal (&&) 
);
Cuando un usuario intenta reservar la mesa de diamantes para el intervalo temporal de las $10:00$ a las $12:00$ horas, y un segundo intento de reserva busca el espacio de las $11:30$ a las $13:00$ horas para el mismo recurso, la base de datos detiene la transacción de forma atómica y arroja un error con código 23P01 (Exclusion Violation).Sincronización de Flujo Bidireccional de ReservasEste flujo de datos asegura la comunicación en tiempo real entre el cliente y el personal del Atelier:Selección del Cliente: El usuario registrado accede a su panel privado, visualiza las fechas disponibles consultando la tabla de citas y selecciona un horario en el calendario interactivo.Generación del Rango Temporal: El cliente web convierte los límites horarios seleccionados en un rango ISO temporal para PostgreSQL (por ejemplo, `Escritura Transaccional: El frontend de Next.js envía la petición a Supabase utilizando el SDK del cliente. La base de datos valida la restricción de exclusión.Alerta en Tiempo Real: Si la inserción es exitosa, el ERP administrativo recibe una alerta instantánea mediante la escucha del canal de suscripción en tiempo real (supabase.channel), lo que permite al asesor asignar un cubículo específico y preparar notas previas sobre el historial del cliente.Directrices Visuales y Blueprint de Interfaz del ERPEl panel de administración interna ERP está diseñado como una extensión digital del Atelier físico. Se prescinde por completo de plantillas genéricas o de colores claros corporativos, envolviendo al administrador en un ambiente oscuro y arquitectónico que exalta el color de los metales y las gemas preciosas.Paleta de Colores y Elementos TipográficosCSS:root {
  /* Fondo Envolvente */
  --color-dashboard-bg: #2C3729;    /* Bosque Profundo / Dark Olive */
  
  /* Contenedores de Información */
  --color-card-bg: #1F271D;         /* Antracita / Deep Charcoal */
  
  /* Líneas de Borde y Estructura */
  --color-border-antique: #CBB67B;  /* Oro Antiguo */
  
  /* Estados e Interacciones */
  --color-gold-hover: #E4D5A4;      /* Oro Antiguo Brillante */
  --color-text-muted: #8E9A8B;      /* Verde Salvia Muted */

  /* Definición Tipográfica */
  --font-headings: "Bluter Stencil", serif; /* Para títulos de sección principales */
  --font-data: "Raleway", sans-serif;       /* Para tablas, métricas y analíticas */
}
Planos de Diseño de los Módulos Clave del ERP1. Panel de Inventario Serializado y Stock InteligenteEste módulo permite una visualización unificada de todas las piezas disponibles y vendidas en el Atelier, organizadas por el SKU serializado. Utiliza un filtrado inteligente por categorías estables de productos y colecciones.┌─────────────────────────────────────────────────────────────────────────────┐
│  INVENTARIO SERIALIZADO                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  SKU SERIALIZADO         PRODUCTO          COLECCIÓN      ESTATUS   ACCIONES│
│  MA-AN-ETE-O14-PUN-0001  Anillo Oro 14k    Etérea           [Editar]│
│  MA-CO-CHA-PL9-AUT-0023  Collar Chai Plata Chai           [Vendido][Ver]   │
└─────────────────────────────────────────────────────────────────────────────┘
2. Panel Especial de Concierge y Pedidos PersonalizadosPermite rastrear cada fase del modelado y orfebrería de las joyas hechas a medida solicitadas por clientes VIP, proporcionando un canal de comunicación directo con el orfebre a cargo en el taller.┌─────────────────────────────────────────────────────────────────────────────┐
│  CONCIERGE & PEDIDOS PERSONALIZADOS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ORDEN   CLIENTE          ESPECIFICACIONES   ESTATUS         AVANCE ARTESANO│
│  #1024   Adriana Garza    Anillo Oro Blanco  [Elaboración]   "Esculpiendo   │
│                           Talla 6, Rubí 2ct                   el molde..."  │
│   │
└─────────────────────────────────────────────────────────────────────────────┘
3. Panel de Analíticas Globales y Tendencias de ConversiónCentraliza el comportamiento de compra y navegación en la web agregando métricas críticas por períodos configurables (Día, Semana, Mes, Año).┌─────────────────────────────────────────────────────────────────────────────┐
│  ANALÍTICAS GLOBALES                          [ Período: Mensual ▾ ]        │
├─────────────────────────────────────────────────────────────────────────────┤
│  VISITAS TOTALES     CARRITOS ABANDONADOS     VENTAS CONCIERGE   TASA CONV. │
│  24,500              142                      $450,000 MXN       2.4%       │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ Gráfica de Líneas: Comportamiento de Ventas de Ultra-Lujo vs Estándar ]  │
└─────────────────────────────────────────────────────────────────────────────┘
4. Panel de CRM y Gestión de MembresíasMuestra de forma segmentada la base de clientes capturada por el sistema. Separa de forma estricta los perfiles con base en el valor de la relación de consumo para dirigir campañas de marketing exclusivas.┌─────────────────────────────────────────────────────────────────────────────┐
│  CRM THE CIRCLE & NEWSLETTER                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│     │
├─────────────────────────────────────────────────────────────────────────────┤
│  CLIENTE          EMAIL               MEMBRESÍA     HISTORIAL DE COMPRAS    │
│  Carlos Slim Jr   c.slim@vip.mx       The Circle    3 compras ($180k MXN)   │
│  Suscriptor 14    user@mail.com       Standard      N/A (Solo Boletín)      │
└─────────────────────────────────────────────────────────────────────────────┘
5. Calendario y Showroom del AtelierPermite una vista bidireccional interactiva de la disponibilidad de las salas y mesas del showroom privado para evitar superposiciones y preparar la mesa de exhibición de forma personalizada.┌─────────────────────────────────────────────────────────────────────────────┐
│  SHOWROOM & ATELIER CALENDAR                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  RECURSO / MESA         10:00 AM       11:00 AM       12:00 PM     01:00 PM │
│  Mesa Diamantes           -- Disponible --      │
│  Cubículo Privado 1     -- Disponible --              [ Cita A.M. ]         │
└─────────────────────────────────────────────────────────────────────────────┘
Plan de Ejecución Sistémica y DevOps RoadmapEl despliegue integrado del monorepo en Vercel utiliza subdominios enrutados por middleware para compartir de forma segura el pool de conexiones de Supabase y las configuraciones globales de Cloudinary con una inversión nula en infraestructura permanente ($\text{CAPEX} = 0$).Canalización de Integración y Entrega Continua (CI/CD)
                 │
                 ▼
[ Canalización de GitHub Actions ]
 ├── Ejecución de Pruebas Unitarias e Integración
 └── Validación de Tipos Generados de Supabase (TypeScript)
                 │
                 ▼

 ├── Compilación única del Monorepo
 ├── Mapeo de Subdominio www a Carpetas (public)
 └── Mapeo de Subdominio admin a Carpetas (admin)
La compilación perimetral genera entornos de prueba (Preview Environments) automáticos para cada rama de desarrollo (Pull Request), permitiendo al personal administrativo probar nuevas funciones en admin-preview.minervaalcarazjoyeria.mx antes de liberarlas en producción.Cronograma de Ejecución del Proyecto (Gantt Operativo)Para garantizar un desarrollo sin contratiempos, el despliegue del sistema se divide en cuatro sprints de una semana de duración cada uno, detallando los entregables correspondientes en el siguiente cronograma:Semana / SprintNombre del SprintTareas de Desarrollo de SoftwareEntregables ClaveSemana 1Base de Datos e Infraestructura Relacional Creación del esquema SQL, enums, tablas relacionales, índices GIST y RLS inicial.Base de datos Supabase en línea con protección estricta de tablas.Semana 2Automatización de Medios e Ingesta Atómica Desarrollo del código de subida y creación de la Edge Function para firmas seguras de Cloudinary.Supabase Edge Function activa y flujo de carga directa sin credenciales en frontend.Semana 3Frontend y Maquetación de Interfaz ERPCodificación del Layout con la paleta Bosque Profundo, Raleway y Bluter Stencil. Integración de paneles del ERP.Pantallas de administración interactivas con carga de datos asíncrona optimizada.Semana 4Enrutamiento Multidominio y Políticas RLS Configuración del Middleware de Next.js, inyección de Custom Claims JWT y despliegue en Vercel.Monorepo desplegado en producción bajo los dominios correspondientes y con seguridad RLS activa.Directrices de Seguridad y Mantenimiento de la InfraestructuraUna vez desplegado el sistema, el equipo de desarrollo de Minerva Alcaraz Joyería debe seguir de manera rigurosa las siguientes tres reglas operativas para garantizar la resiliencia del software y salvaguardar la información sensible de los clientes de ultra-lujo:Mantenimiento Estricto de la Seguridad de Fila: Bajo ninguna circunstancia se debe omitir la declaración de políticas de Row Level Security (RLS) en tablas que manejen información financiera, analíticas de conversión o perfiles de clientes. La base de datos debe mantener la política de denegación de lectura por defecto a menos que se declare explícitamente una regla de acceso.Resguardo Criptográfico de Credenciales: Nunca se deben insertar las llaves secretas maestras de administración (service_role de Supabase o API Secret de Cloudinary) en el código del cliente web o archivos con acceso público del monorepo. Toda operación con privilegios de escritura o firmas de seguridad se ejecutará exclusivamente dentro del contexto aislado de las Supabase Edge Functions utilizando autenticación JWT.Validación de Rangos y Restricciones de Sanidad: En futuras actualizaciones del módulo del showroom, se debe garantizar que cualquier inserción de citas de visitas presenciales valide la estructura del tipo de rango (tstzrange), evitando la degradación del rendimiento del motor relacional mediante la reevaluación manual de las restricciones horarias en el lado del servidor de la aplicación. El panel de gestion de productos permitira al administrador subir productos en tiempo real con todos los filtrados actuales, categorias, sets, subir a colecciones, piezas unicas, generara una etiqueta de serializacion en base al sku y las etiquetas definidas en el producto, su contenido, precio y fotografias por cada producto, si es mas de una por producto se subira como carpeta y tambien el orden de visualizacion, se podra renderizar en el ERP una UI de previsualizacion de como quedaria la PDP en la pagina de cliente ya con todas sus etiquetas, narrativa y fotografias. 