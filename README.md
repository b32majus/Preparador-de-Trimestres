# Preparador de Trimestres

**Organiza tu documentación trimestral antes de enviarla a tu asesor**

Una aplicación web diseñada para autónomos que facilita la preparación y organización de documentación fiscal trimestral con una experiencia centrada en la calma y la tranquilidad.

## 🎯 Características Principales

- **Landing Page** con diseño Sophilux - Presenta el producto con secciones Hero, "Cómo funciona", deducciones comunes, y memoria trimestral
- **Autenticación Magic Link** - Inicio de sesión sin contraseña vía Supabase Auth
- **Dashboard Intuitivo** - Vista general de trimestres con progreso y mensajes contextuales
- **Checklist Guiada** - Sistema de 3 estados (pendiente → hecho → dudoso) con feedback inmediato
- **Gestión de Documentos** - Subida, organización y vista previa de archivos
- **Memoria Trimestral** - El sistema aprende de trimestres anteriores y sugiere gastos recurrentes
- **Microcopy Empático** - Mensajes contextuales que reducen ansiedad y normalizan dudas
- **Resumen Exportable** - Genera certificados descargables para enviar a tu asesor
- **Diseño Responsive** - Optimizado para móvil, tablet y desktop

## 📂 Estructura del Proyecto

```
/src
  /components
    /layout           # Header, Sidebar, Footer
    /trimestre        # ChecklistItem, DocumentUpload, ProgressBar
    /ui               # Badge, Button, ContextualMessage
  /layouts
    Landing.astro     # Layout base con SEO completo
    Layout.astro      # Layout para páginas autenticadas
  /lib
    microcopy.js      # Sistema de mensajes contextuales
    normalizationMessages.js  # Mensajes de normalización
    supabase.js       # Cliente Supabase (browser)
    supabase-server.js  # Cliente Supabase (SSR)
    date-utils.js     # Utilidades de fecha
  /pages
    index.astro       # Landing page pública
    login.astro       # Autenticación Magic Link
    dashboard.astro   # Panel principal (requiere auth)
    trimestre.astro   # Vista de trimestre individual
    resumen.astro     # Resumen con certificado
    certificado.astro # Certificado descargable
    ajustes.astro     # Configuración de usuario
  /styles
    global.css        # Sistema de diseño Sophilux

/public
  /assets             # Imágenes, favicons, og-image
```

## 🎨 Sistema de Diseño Sophilux

El proyecto utiliza un sistema de diseño custom basado en CSS Variables que prioriza la calidez, elegancia y tranquilidad.

### Paleta de Colores

```css
--color-primary: #B8897D      /* Rosa/marrón cálido - Principal */
--color-primary-hover: #A67868
--color-success: #4A7C59      /* Verde suave - Éxito */
--color-warning: #D4A84B      /* Ámbar - Advertencia */
--bg-page: #FAF8F5            /* Crema - Fondo */
--text-main: #2D2926          /* Casi negro - Texto principal */
--text-secondary: #6B635D     /* Gris cálido - Texto secundario */
--border-soft: #E8E4E0        /* Beige - Bordes */
```

### Tipografía

- **Display/Títulos**: Cormorant Garamond (serif elegante)
- **Cuerpo**: Inter (sans-serif legible)
- **Iconos**: Material Symbols Outlined

### Variables de Espaciado

```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
--spacing-3xl: 4rem     /* 64px */
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(184, 137, 125, 0.04)
--shadow-md: 0 4px 6px -1px rgba(184, 137, 125, 0.08)
--shadow-lg: 0 10px 15px -3px rgba(184, 137, 125, 0.1)
--shadow-soft: 0 4px 12px -4px rgba(184, 137, 125, 0.3)
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+
- npm o pnpm
- Cuenta de Supabase (para backend)

### Instalación

```bash
# Clonar repositorio
git clone [repo-url]
cd preparador-de-trimestres

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
PUBLIC_SUPABASE_URL=tu_supabase_url
PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### Scripts Disponibles

```bash
# Desarrollo local (puerto 4321)
npm run dev

# Build para producción
npm run build

# Preview de build de producción
npm run preview

# Linting
npm run astro check
```

## 📄 Páginas y Rutas

### Públicas

- **`/`** - Landing page con SEO completo
  - Hero con CTA
  - Sección "Cómo funciona" (3 pasos)
  - "Lo que olvidas deducir" (4 categorías)
  - Memoria trimestral (Q1→Q2)
  - Footer con enlaces

- **`/login`** - Autenticación Magic Link
  - Formulario de email
  - Envío de enlace mágico vía Supabase Auth
  - Redirección automática si ya hay sesión

### Protegidas (Requieren Autenticación)

- **`/dashboard`** - Panel principal
  - Lista de trimestres (Q1-Q4 del año actual)
  - Barra de progreso por trimestre
  - Mensaje contextual según día del mes y progreso
  - Botón "Nuevo Trimestre"

- **`/trimestre?id={id}`** - Vista de trimestre individual
  - Checklist de 18 ítems en 5 secciones
  - Subida de documentos por ítem
  - Estados: pendiente, hecho, dudoso
  - Barra de progreso dinámica
  - Tip box con mensaje de normalización aleatorio
  - Botón "Cerrar Trimestre"

- **`/resumen?id={id}`** - Resumen final
  - Checklist completada
  - Lista de documentos subidos
  - Tarjeta de fecha de cierre
  - Botón "Generar Certificado"
  - Mensaje de celebración

- **`/certificado?id={id}`** - Certificado descargable
  - Resumen formateado para imprimir/PDF
  - Checklist + documentos organizados
  - Mensaje final: "Puedes soltar esto de tu cabeza"

- **`/ajustes`** - Configuración de usuario
  - Información de cuenta
  - Cerrar sesión

## 🧩 Componentes Principales

### Layout Components

- **`Header.astro`** - Navbar con logo Sophilux, título, y navegación
- **`Sidebar.astro`** - Menú lateral con Dashboard, Ajustes, Cerrar sesión
- **`Footer.astro`** - Footer con copyright y badge Sophilux

### UI Components

- **`Badge.astro`** - Pills de estado (Listo, Cerrado, Pendiente)
- **`ContextualMessage.astro`** - Mensajes empáticos basados en progreso
- **`Button.astro`** - Botones del sistema de diseño

### Trimestre Components

- **`ChecklistItem.astro`** - Ítem de checklist con estados y acciones
  - Click para cambiar estado (pending → done → doubtful → pending)
  - Botón "Subir documento" (condicional)
  - Notificación temporal al marcar como dudoso

- **`DocumentUpload.astro`** - Componente de subida de archivos
- **`ProgressBar.astro`** - Barra de progreso visual

## 🧠 Sistema de Microcopy

El proyecto implementa un sistema de mensajes contextuales diseñado para reducir ansiedad y motivar al usuario:

### Mensajes Contextuales (Dashboard)

Función: `getContextualMessage(progress, dayOfMonth)`

- **Día 1-10 + progreso < 30%**: "Acabas de empezar. Tranquilo."
- **Día 10-15 + progreso 40-70%**: "Vas por la mitad. Esto ya es más de lo que la mayoría hace."
- **Día 15-20 + progreso < 50%**: "Aún queda un poco. Un último empujón."
- **Progreso >= 80%**: "Casi terminado. Ya queda muy poco."

### Mensajes de Normalización (Trimestre)

5 variaciones aleatorias que normalizan dudas:

- "El 70% de usuarios marca al menos un ítem como dudoso."
- "Marcar algo como dudoso es señal de profesionalidad."
- "No tienes que saberlo todo. Para eso tienes un asesor."
- "La mayoría de usuarios tienen 2-3 dudas por trimestre."
- "Los que marcan más ítems como dudosos encuentran más deducciones."

### Mensajes de Ítem Dudoso

4 variaciones al marcar un ítem como dudoso:

- "Perfecto. Tu asesor lo revisará."
- "Bien marcado. Es mejor preguntar que asumir."
- "Tranquilo, tu asesor está para esto."
- "Dudas = profesionalidad. Vas bien."

## 🗄️ Base de Datos (Supabase)

### Tablas

**`trimestres`**
```sql
- id (uuid, PK)
- user_id (uuid, FK a auth.users)
- quarter (1-4)
- year (number)
- status ('open' | 'closed')
- created_at (timestamp)
- closed_at (timestamp, nullable)
```

**`checklist_items`**
```sql
- id (uuid, PK)
- trimestre_id (uuid, FK)
- section (text)
- item_text (text)
- status ('pending' | 'done' | 'doubtful')
- order (number)
```

**`documents`**
```sql
- id (uuid, PK)
- trimestre_id (uuid, FK)
- checklist_item_id (uuid, FK, nullable)
- file_name (text)
- file_url (text)
- file_size (number)
- uploaded_at (timestamp)
```

### Autenticación

- **Proveedor**: Supabase Auth con Magic Link (OTP)
- **Flujo**: Email → Magic Link → `/auth/callback` → `/dashboard`
- **Sesión**: Gestionada por Supabase (cookies + localStorage)

### Storage

- **Bucket**: `trimestre-documents`
- **Política**: Authenticated users pueden subir/ver sus propios documentos
- **Path**: `{user_id}/{trimestre_id}/{filename}`

## 📱 Responsive Design

Breakpoints definidos:

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }
```

### Adaptaciones Móviles

- Navbar con menú hamburguesa
- Grids que colapsan a una columna
- Sidebar convertida en overlay
- Notificaciones de ancho completo
- Padding reducido en cards

## 🔍 SEO

La landing page incluye optimización SEO completa:

- **Meta tags**: Title, description, canonical URL
- **Open Graph**: Facebook sharing (og:title, og:description, og:image)
- **Twitter Cards**: Twitter sharing (twitter:card, twitter:image)
- **Structured Data**: Ready para implementar JSON-LD
- **Performance**: Preconnect a Google Fonts, lazy loading de imágenes

## 🛠️ Stack Tecnológico

- **Framework**: Astro 4.x (SSR + Static)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Lenguajes**: TypeScript, JavaScript, Astro, CSS
- **Iconos**: Material Symbols Outlined
- **Fuentes**: Google Fonts (Cormorant Garamond, Inter)
- **Deploy**: Compatible con Vercel, Netlify, Cloudflare Pages

## 🎯 Próximos Pasos

- [ ] Implementar funcionalidad de menú móvil (hamburguesa)
- [ ] Añadir memoria trimestral (precargar datos de Q anterior)
- [ ] Sistema de notificaciones por email (recordatorios)
- [ ] Analytics y tracking de UX
- [ ] Tests E2E con Playwright
- [ ] Modo oscuro (dark mode)
- [ ] Exportación PDF del certificado
- [ ] Internacionalización (i18n)

## 📝 Licencia

Proyecto privado - Todos los derechos reservados © 2026 Sophilux

---

**Hecho con calma y atención al detalle** 🌿
