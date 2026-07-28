## Club Judo Legazpi — Propuesta de rediseño

### 1. Diagnóstico y enfoque
La web actual funciona como tablón de anuncios: mucha información plana, jerarquía débil y poca claridad en lo que realmente busca la gente. El 80% de las visitas quieren tres cosas: **horarios**, **cómo apuntarse** y **el próximo evento**. Todo el diseño se organiza alrededor de eso.

Propuesta: un sitio **sobrio y deportivo** —tipografía fuerte, mucho negro/blanco, fotos reales grandes y un único color corporativo como acento— con navegación de 6 entradas máximo y una barra inferior fija en móvil con las 3 acciones clave.

### 2. Mapa del sitio

```text
/                     Inicio: hero con foto real, próximo evento, horarios de un vistazo, CTA "Probar una clase"
/club                 Historia, valores, instalaciones, galería
/cuerpo-tecnico       Fichas de entrenadores (foto, cinturón, titulación, bio)
/horarios             Tabla por grupos/edades + tarifas + CTA inscripción
/calendario           Agenda de eventos filtrable (competición, examen, curso)
/torneos              Torneos organizados por el club, con ficha e histórico
/lopivi               Política de protección, delegado, canal de comunicación
/documentos           Descargas PDF por categorías
/contacto             Formulario, mapa, dirección, redes (Instagram y Telegram)
/eu/...               Misma estructura en euskera
/auth                 Acceso privado del administrador
/admin/*              Panel de gestión
```

### 3. Decisiones de diseño (el porqué)
- **Nada infantil**: sin colores pastel ni ilustraciones. Contraste alto, esquinas ligeramente marcadas, fotos del tatami a sangre. Transmite club serio y federado.
- **Móvil primero de verdad**: barra inferior fija con Horarios / Calendario / Contacto. Menú hamburguesa solo para el resto.
- **Horarios como pieza estrella**: tarjetas por grupo de edad, no una tabla ilegible en móvil. Se puede filtrar por día.
- **Calendario y torneos separados**: el calendario es "qué pasa pronto"; torneos es contenido de marca y SEO local (páginas indexables por edición).
- **LOPIVI visible en el menú principal**: transmite confianza a las familias y es requisito legal; hoy suele estar escondido.
- **Accesibilidad AA**: contraste verificado, navegación por teclado, textos alternativos, jerarquía de encabezados única por página.
- **SEO**: cada ruta con su propio título, descripción y og:image; datos estructurados (SportsClub + Event) en inicio, calendario y torneos; sitemap y robots.

### 4. Qué edita el administrador
Panel privado en `/admin`, con login. Solo lo que pediste:
horarios y grupos · eventos del calendario · cuerpo técnico · torneos · documentos PDF (subida) · imágenes/galería · textos puntuales (LOPIVI, sobre el club, contacto). Cada campo tiene versión en castellano y euskera.
El resto de la web es estático y no se toca desde el panel.

### 5. Bilingüe ES/EU
Selector en la cabecera, rutas separadas (`/` y `/eu/`) para que Google indexe ambas versiones con `hreflang`. El contenido editable guarda ambos idiomas en el mismo registro; si falta la traducción, se muestra el castellano.

### 6. Detalles técnicos
- TanStack Start (React + Vite), Tailwind v4 con sistema de tokens propio a partir de vuestros colores corporativos. Código estándar y exportable, sin proveedor cerrado.
- Backend con Lovable Cloud (base de datos Postgres + almacenamiento de PDFs/imágenes + autenticación). Un solo rol `admin`; lectura pública restringida a contenido publicado.
- Tablas: `schedules`, `events`, `staff`, `tournaments`, `documents`, `gallery_images`, `site_texts`, `user_roles`.
- Renderizado en servidor para velocidad y SEO; imágenes optimizadas y carga diferida.

### 7. Orden de construcción
1. Sistema de diseño con vuestros colores + maqueta de Inicio.
2. Páginas públicas estáticas (Club, Horarios, Cuerpo técnico, LOPIVI, Contacto).
3. Backend, autenticación y panel de administración.
4. Contenido dinámico conectado (calendario, torneos, documentos, galería).
5. Bilingüe, SEO técnico, accesibilidad y ajustes finales.

### Lo que necesito de ti
El logo, los códigos de color corporativos y una selección de fotos reales del club. Puedo empezar por el sistema de diseño y la home en cuanto los subas; si prefieres, arranco ya con una paleta provisional y las sustituimos después.
