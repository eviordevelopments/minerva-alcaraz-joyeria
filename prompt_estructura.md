 Digital Luxury Atelier Architect
Contexto del Sistema: Actúa como un Lead Solutions Architect especializado en E-commerce de ultra-lujo. Tu objetivo es diseñar la arquitectura central de la plataforma para Minerva Alcaraz Joyería. El desarrollo será ejecutado por E-vior Developments bajo principios de ingeniería sistémica.
Metodología de Ejecución:
Working Backwards: El diseño debe validar el PR (Comunicado de Prensa) y el FAQ de usuario final antes de definir la técnica.
Lean Engineering: Priorizar el rendimiento del sitio (carga rápida), la navegación intuitiva y la eliminación de pasos innecesarios en el embudo de conversión.
Estética Sistémica: Minimalismo moderno fusionado con la tradición artesanal del sector joyero.

1. Orquestación de Agentes (Roles)
Instruye a Antigravity para que divida la tarea en tres agentes autónomos:
Agente A (Brand Visionary): Define la narrativa, el tono de voz y la "psicología del lujo" en cada micro-copy.
Agente B (UX/UI Systemic Designer): Crea la estructura visual, jerarquía de información y flujos de interacción (incluyendo el efecto hover-flip).
Agente C (Lean Tech Engineer): Estructura la lógica de datos, integraciones de pago, API de WhatsApp y optimización de recursos.

2. Definición de Componentes de la Estructura Central
Diseña cada sección basándote en los siguientes requerimientos técnicos y visuales:
A. Capa de Descubrimiento (Navegación y Catálogo)
Sección Colecciones: Galería tipo museo. Cada colección debe tener un "Manifiesto" (breve descripción narrativa).
Sección por Tipo: Filtros minimalistas. Uso de iconos lineales de alta gama para Anillos, Pulseras, Collares y Aretes.
Interacción de Producto: Implementar lógica de Hover State donde la imagen principal (estudio) rote a una imagen secundaria (contexto/modelo) con una transición suave de 300ms.
B. Capa de Valor y Confianza (Educación)
Acerca de Nosotros: Narrativa visual sobre el origen de Minerva Alcaraz y el proceso artesanal.
Guía de Tallas Interactiva: Módulo de ingeniería simple para medir anillos, pulseras y cadenas, visualmente integrado en la estética del sitio.
Ritual de Cuidados: Sección con diseño editorial (estilo revista de lujo) sobre el mantenimiento de las piezas.
C. Capa de Conversión y Fidelidad
Ficha de Producto (PDP):
Display de dimensiones y materiales con tipografía Serif elegante.
Sección de Significado: Un campo de metadatos obligatorio que explique la "alma" de la pieza.
Personalizados: Formulario de contacto tipo "Concierge" para solicitudes especiales, conectado directamente al flujo de diseño de E-vior.
Programa "The Circle": Lógica de suscripción para bonos y descuentos de fidelidad con una interfaz de "Miembro Exclusivo".
D. Capa Operativa (Lean Checkout)
Carrito & Lista de Deseos: Diseño flotante lateral para no interrumpir la navegación.
Pasarela de Pagos: Integración visual de logos (Visa, AMEX, PayPal) en el pie de página de forma discreta.
Soporte: Botón flotante de WhatsApp estilizado (no intrusivo).

3. Instrucciones de Salida (Deliverables)
Para cada sección, Antigravity debe entregar:
User Story: ¿Qué siente el cliente en este punto?
Wireframe Lógico: Descripción de la jerarquía de elementos.
Especificación Lean: Qué datos se necesitan y cómo se optimizan para no afectar el SEO o la velocidad.

Guía Visual Sugerida para la Estructura

Nota para la ejecución con E-vior: Al aplicar este prompt, asegúrate de que Antigravity priorice la responsividad móvil, ya que el 80% de las interacciones de lujo ocurren en dispositivos móviles. La estructura debe ser "limpia": si un elemento no añade valor emocional o funcional, se elimina (Lean).
Aquí tienes la paleta de colores extraída directamente de la imagen, ideal para mantener la coherencia visual en el desarrollo de E-vior para la joyería:
🎨 Paleta de Colores "Minerva Alcaraz"
Color
Hexadecimal
RGB
Descripción Sugerida
Hueso Seda
#E5DBD6
(229, 219, 214)
Fondo principal / Espacios negativos.
Plata Niebla
#C3C9C0
(195, 201, 192)
Detalles secundarios / Divisores.
Oro Antiguo
#CBB67B
(203, 182, 123)
Acentos / Botones de acción (CTA).
Verde Ébano
#2C3729
(44, 55, 41)
Tipografía principal / Textos de lujo.
Bosque Profundo
#294127
(41, 65, 39)
Secciones de contraste / Pie de página.

Dark Olive
C: 76%, M: 53%,
Y: 76%, K: 65%

Olive
C: 19%, M: 26%,
Y: 62%, K: 5%

Light Gray
C: 28%, M: 16%,
Y: 24%, K: 1%

Lavender Blush
C: 11%, M: 16%,
Y: 15%, K: 0%
:root { --color-primary-bg: #E5DBD6; --color-secondary-muted: #C3C9C0; --color-accent-gold: #CBB67B; --color-text-dark: #2C3729; --color-brand-deep-green: #294127; }
Tipografia

Bluter Stencil

ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz

Aa 123456789¿?$”&

Bluter Aa

Raleway Aa

ABCDEFGHIJKLMNOPQRSTUVWXYZ

abcdefghijklmnopqrstuvwxyz

123456789¿?$”&

ABCDEFGHIJKLMNOPQRSTUVWXYZ

abcdefghijklmnopqrstuvwxyz

123456789¿?$”&

Para que el MVP de Minerva Alcaraz Joyería sea impecable, la lógica debe trascender la simple funcionalidad. Cada clic debe sentirse como una invitación a un atelier privado.
A continuación, presento la estructura sistémica final, integrando la paleta de colores (#E5DBD6, #CBB67B, #2C3729) y la lógica de Lean Engineering para asegurar una entrega de alto valor.

1. Arquitectura de Navegación (Global Header & Footer)
Header (Lógica de Persistencia): Menú minimalista con efecto glassmorphism.
Secciones: Joyas (Dropdown por tipo) | Colecciones | Personalizados | The Circle (Lealtad).
Acciones rápidas: Buscador predictivo, Lista de deseos (corazón), Carrito (sidebar).
Footer (Lógica de Confianza):
Suscripción al boletín con copy de alta gama: "Únete a la herencia".
Logos de métodos de pago en opacidad reducida.
Acceso directo a Políticas y Guías de Tallas.

2. Estructura de Páginas: Diseño y Lógica
A. Home Page (La Fachada del Lujo)
Hero Section: Video en loop de 5 segundos (proceso artesanal) con superposición de texto minimalista.
Sección Colecciones: Grid asimétrico. Cada bloque de colección tiene una breve frase narrativa (Storytelling).
Sección "Por Tipo": Carrusel horizontal con iconos lineales. Al pasar el cursor sobre el icono, este cambia de color a #CBB67B (Oro Antiguo).
B. Listing Page (Catálogo de Productos)
Lógica de Interacción:
Hover Flip: La imagen 1 (Estudio/Fondo Hueso #E5DBD6) cambia a Imagen 2 (Estilo de vida/Modelo) con una transición de 0.4s.
Filtros: Minimalistas por Material, Precio y Significado.
Visual: Tarjetas de producto con bordes redondeados mínimos y tipografía en #2C3729.
C. Product Detail Page (PDP - El Núcleo)
Aquí es donde reside la mayor carga de valor:
Lógica Visual: Zoom suave en las imágenes.
Información Sistémica:
Acordeón de Detalles: Pestañas para "Dimensiones", "Materiales" y el "Significado" (Narrativa poética de la pieza).
Guía Rápida: Enlace directo a "Cómo medir tu dedo" justo al lado del selector de tallas.
CTA: Botón "Añadir a la Bolsa" en #294127 con texto en blanco seda.

3. Centro de Educación y Soporte (Educación al Cliente)
Página / Sección
Lógica de Diseño
Componente Clave
Guía de Tallas
Tablas comparativas e imágenes vectoriales.
Botón para descargar PDF "Medidor Imprimible".
Cuidados de Piezas
Listado de "Rituales de Limpieza" (paso a paso).
Infografías minimalistas sobre qué evitar (químicos, perfume).
Personalizados
Formulario tipo Step-by-step (Concierge).
Integración de carga de imágenes para referencias del cliente.
Políticas
Texto estructurado por puntos, lenguaje claro.
Sección "Garantía de Autenticidad".


4. Lógica de E-commerce y Operaciones (Back-end/UX)
Lista de Deseos: Guardado mediante cuenta de usuario o cookies de sesión para persistencia.
El Carrito (Sidebar): No saca al usuario de la página. Muestra una barra de progreso para "Envío de Cortesía" (si aplica).
Pasarela de Pagos:
Seguridad: Sellos de SSL visibles.
Opciones: Visa, Mastercard, AMEX, PayPal y transferencia bancaria.
Fidelidad ("The Circle"):
Suscripción: Al registrarse, el usuario recibe un código de bienvenida automático vía email.
Dashboard: El cliente puede ver sus "Bonos de Lealtad" acumulados para su próxima compra.
WhatsApp Concierge: Botón flotante en la esquina inferior derecha, personalizado con el mensaje: "Deseo asesoría personalizada sobre [Nombre de la pieza]".

5. Especificaciones para el MVP (Lean Engineering)
Nota para el equipo de desarrollo:
Optimización de Imágenes: Todas las fotografías deben estar en formato .webp para mantener la velocidad del sitio sin perder la calidad del lujo.
Mobile-First: La navegación de las guías de tallas debe ser táctil y 100% responsiva.
Micro-interacciones: Utilizar la paleta de colores para feedback visual (ej. el botón de carrito se ilumina en Oro al agregar un ítem).
Con esta estructura, el MVP no solo será funcional, sino que proyectará la autoridad y el prestigio de Minerva Alcaraz desde el primer día.
