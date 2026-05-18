-- =====================================================================
-- 09_ERP_TABLES_AND_SHOWROOM.SQL
-- Minerva Alcaraz Joyería - ERP & Showroom System Migration
-- =====================================================================

-- 1. TIPOS ENUMERADOS ADICIONALES (Taxonomías Operativas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_joya') THEN
        CREATE TYPE tipo_joya AS ENUM (
            'Anillos', 'Collares', 'Pendientes', 'Piezas Únicas', 'Sets', 'Pulseras', 'Colecciones'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coleccion_joya') THEN
        CREATE TYPE coleccion_joya AS ENUM (
            'Amatista', 'Chai', 'Escencia', 'Diseños de Autor', 'Piezas Únicas', 
            'Etérea', 'Serpientes', 'Floral', 'Ecos de la Tierra', 'Anillos de Piedras'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'material_joya') THEN
        CREATE TYPE material_joya AS ENUM (
            'Plata.925', 'Amatista Natural', 'Baño de Oro 24k', 'Oro 14k', 'Rubíes', 
            'Detalles en Oro 14k', 'Oro Amarillo 18k', 'Texturizado a mano', 'Plata Ley.950', 
            'Perla Negra de Tahití', 'Oro Blanco 14k', 'Zafiros Blancos', 'Ojos de Esmeralda', 
            'Centro de Citrino', 'Plata.950 Envejecida', 'Cuarzo Hialino'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'preferencia_joya') THEN
        CREATE TYPE preferencia_joya AS ENUM (
            'Piezas Únicas', 'Edición Limitada', 'Diseño de Autor'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_pedido') THEN
        CREATE TYPE status_pedido AS ENUM (
            'Recibido', 'En preparación', 'Elaboración', 'Enviando', 'Entregado', 'Devuelto'
        );
    END IF;
END
$$;

-- 2. TABLA MAESTRA DE PRODUCTOS (SI NO EXISTE)
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL CHECK (precio >= 0),
    tipo tipo_joya NOT NULL,
    coleccion coleccion_joya NOT NULL,
    preferencia preferencia_joya NOT NULL,
    narrativa_emocional TEXT NOT NULL,
    detalles_tecnicos TEXT NOT NULL,
    caracteristicas_json JSONB DEFAULT '{"tallas": [], "colores": []}'::JSONB,
    sugeridos UUID[] DEFAULT '{}',
    disponible BOOLEAN DEFAULT TRUE,
    is_exclusive_circle BOOLEAN DEFAULT FALSE,
    seo_keywords VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. TABLA DE MATERIALES POR PRODUCTO
CREATE TABLE IF NOT EXISTS public.producto_materiales (
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    material material_joya NOT NULL,
    PRIMARY KEY (producto_id, material)
);

-- 4. TABLA DE IMÁGENES DE PRODUCTO
CREATE TABLE IF NOT EXISTS public.producto_imagenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    cloudinary_url TEXT NOT NULL,
    is_cover BOOLEAN DEFAULT FALSE,
    is_packaging BOOLEAN DEFAULT FALSE,
    hover_lifestyle_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. TABLA DE STOCK SERIALIZADO (Identificación Física Unívoca)
CREATE TABLE IF NOT EXISTS public.inventario_serializado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE RESTRICT,
    numero_serie_unico VARCHAR(100) UNIQUE NOT NULL, -- SKU-0001
    disponible BOOLEAN DEFAULT TRUE NOT NULL,
    ubicacion_fisica VARCHAR(100) DEFAULT 'Atelier Principal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. TABLA DE EVENTOS ANALÍTICOS (Métricas del Embudo)
CREATE TABLE IF NOT EXISTS public.eventos_analiticas (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tipo_evento VARCHAR(50) NOT NULL, -- 'vista_producto', 'add_to_cart', 'init_checkout', 'purchase'
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    metadatos JSONB DEFAULT '{}'::JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. TABLA DE SUSCRIPCIONES A NEWSLETTER
CREATE TABLE IF NOT EXISTS public.newsletter_suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. TABLA DE RECURSOS DE SHOWROOM (Salas o mesas físicas)
CREATE TABLE IF NOT EXISTS public.recursos_showroom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_recurso VARCHAR(100) NOT NULL, -- 'Mesa Principal de Diamantes', 'Cubículo Privado 1'
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. TABLA DE CITAS EN EL SHOWROOM (Planificador con prevención de solapamientos)
CREATE TABLE IF NOT EXISTS public.citas_showroom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recurso_id UUID REFERENCES public.recursos_showroom(id) ON DELETE RESTRICT,
    duracion_cita TSTZRANGE NOT NULL, -- Rango temporal de inicio y fin con zona horaria
    motivo_visita VARCHAR(255) NOT NULL,
    estatus_cita VARCHAR(50) DEFAULT 'Pendiente de confirmación', -- 'Confirmada', 'Completada', 'Cancelada'
    notas_asesor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. TABLA DE PEDIDOS PERSONALIZADOS DE CONCIERGE
CREATE TABLE IF NOT EXISTS public.pedidos_personalizados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    sku_serializado VARCHAR(100) NOT NULL,
    monto_total DECIMAL(12, 2) NOT NULL,
    status_proceso status_pedido DEFAULT 'Recibido' NOT NULL,
    detalles_personalizacion JSONB NOT NULL, -- Talla, grabados, selección de gemas
    tiempo_estimado_entrega DATE,
    notas_artesano TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =====================================================================
-- INDEXACIÓN Y SOPORTE DE INDICES ESPACIALES (GIST)
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Eliminar restricción previa si existe para evitar duplicados
ALTER TABLE public.citas_showroom DROP CONSTRAINT IF EXISTS prevent_showroom_overlap;

-- Restricción de exclusión física temporal para evitar sobreventa de recursos en la misma hora
ALTER TABLE public.citas_showroom
ADD CONSTRAINT prevent_showroom_overlap
EXCLUDE USING gist (
    recurso_id WITH =,
    duracion_cita WITH &&
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_sku ON public.productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_exclusive ON public.productos(is_exclusive_circle);
CREATE INDEX IF NOT EXISTS idx_inventario_serial_prod ON public.inventario_serializado(producto_id);
CREATE INDEX IF NOT EXISTS idx_citas_showroom_duracion ON public.citas_showroom USING GIST (duracion_cita);
CREATE INDEX IF NOT EXISTS idx_eventos_analiticas_tipo ON public.eventos_analiticas(tipo_evento, timestamp);

-- =====================================================================
-- CONFIGURACIÓN DE SEGURIDAD A NIVEL DE FILA (RLS)
-- =====================================================================
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_serializado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas_showroom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recursos_showroom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_personalizados ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA PRODUCTOS
CREATE POLICY "Productos estándar visibles al público"
ON public.productos FOR SELECT
TO anon, authenticated
USING (is_exclusive_circle = FALSE);

CREATE POLICY "Catálogo exclusivo limitado a miembros The Circle"
ON public.productos FOR SELECT
TO authenticated
USING (
    is_exclusive_circle = TRUE 
    AND ( (SELECT auth.jwt() ->> 'membership') = 'the_circle' )
);

CREATE POLICY "Administradores poseen control total sobre productos"
ON public.productos FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );

-- POLÍTICAS PARA INVENTARIO SERIALIZADO
CREATE POLICY "Solo administradores ven inventario detallado"
ON public.inventario_serializado FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );

-- POLÍTICAS PARA CITAS SHOWROOM
CREATE POLICY "Clientes ven sus propias citas"
ON public.citas_showroom FOR SELECT
TO authenticated
USING ( cliente_id = auth.uid() );

CREATE POLICY "Clientes agendan sus propias citas"
ON public.citas_showroom FOR INSERT
TO authenticated
WITH CHECK ( cliente_id = auth.uid() );

CREATE POLICY "Administradores controlan todas las citas"
ON public.citas_showroom FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );

-- POLÍTICAS PARA PEDIDOS PERSONALIZADOS
CREATE POLICY "Clientes ven sus pedidos personalizados"
ON public.pedidos_personalizados FOR SELECT
TO authenticated
USING ( cliente_id = auth.uid() );

CREATE POLICY "Administradores controlan pedidos de concierge"
ON public.pedidos_personalizados FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );
