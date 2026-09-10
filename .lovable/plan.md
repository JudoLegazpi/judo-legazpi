# Despliegue en hosting Node.js (LucusHost)

## Respuesta corta a "¿dará resultado?"

La parte técnica del cambio es sencilla y segura: la app usa un sistema de compilación (Nitro) que ya soporta oficialmente un servidor Node.js estándar; solo hay que cambiar el destino. Eso lo puedo hacer y verificar aquí mismo arrancando el servidor compilado.

Lo que **no** puedo garantizar al 100% desde aquí son dos cosas, y conviene saberlas antes de empezar:

1. **La clave privada de la nube.** He comprobado que en este proyecto no está disponible (`SUPABASE_SERVICE_ROLE_KEY` no es accesible en Lovable Cloud). Se usa en un único sitio: firmar los enlaces temporales de imágenes y carteles guardados en el almacén privado. Sin ella, en tu hosting las imágenes no se verían. Hay solución (ver más abajo), pero es un cambio real, no un detalle.
2. **Que LucusHost admita este tipo de app.** Un hosting Node.js compartido suele funcionar con cPanel y Passenger. La app necesita **Node 20 o superior** y arrancar un servidor propio. Es lo habitual, pero hay que confirmarlo con ellos antes de contratar o migrar.

Con esas dos cosas resueltas, sí: la web funcionaría igual en LucusHost.

## Plan de trabajo

### Paso 0 — Verificación previa (antes de tocar nada)
Confirmar con LucusHost: versión de Node disponible (20+), si permiten definir el archivo de arranque de la aplicación, y si permiten variables de entorno propias. Si algo de eso falta, el despliegue no es viable en ese plan.

### Paso 1 — Cambiar el destino de compilación a Node.js
En `vite.config.ts`, pasar el destino de Cloudflare a servidor Node. La compilación generará `.output/server/index.mjs`, el punto de entrada que espera LucusHost.

### Paso 2 — Script de arranque
Añadir en `package.json`:
```json
"start": "node .output/server/index.mjs"
```

### Paso 3 — Resolver el tema de las imágenes
Dos opciones, eliges tú:
- **A (recomendada, más simple):** hacer público el almacén de imágenes y documentos. Deja de hacer falta la clave privada; el código de firma se sustituye por enlaces directos. Contra: los archivos serían accesibles por quien tenga el enlace (son carteles, fotos del club y PDFs públicos, así que en la práctica no es un problema).
- **B:** conseguir la clave privada por soporte de Lovable y configurarla como variable de entorno en LucusHost. Mantiene los enlaces firmados.

### Paso 4 — Verificación real aquí
Compilar y arrancar `node .output/server/index.mjs` en este entorno, comprobando que responden la portada, una página en euskera y el panel de administración. Si algo falla, se ve aquí y no en tu hosting.

### Paso 5 — Guía de despliegue
Crear `.env.example` y un `DESPLIEGUE.md` con los pasos exactos: variables a configurar, punto de entrada, versión de Node, y cómo subir la carpeta compilada.

### Paso 6 — Ajuste de dominio
Cuando tengas la URL definitiva, añadirla a las direcciones permitidas de acceso para que el login del administrador siga funcionando. Eso lo hago yo desde aquí.

## Recomendación sobre cómo compilar

Los hosting compartidos suelen quedarse cortos de memoria al compilar. Lo fiable es compilar fuera (en tu ordenador o automáticamente en GitHub) y subir solo el resultado. Puedo dejar preparado ese proceso automático en GitHub para que cada cambio genere el paquete listo para subir.

## Detalle técnico

- `vite.config.ts`: añadir `nitro: { preset: "node-server" }` manteniendo `tanstackStart.server.entry = "server"` (el envoltorio SSR de `src/server.ts`).
- Variables de entorno en el hosting: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (+ `SUPABASE_SERVICE_ROLE_KEY` solo en la opción B).
- La firma de URLs vive en `src/lib/site-content.functions.ts` (`createSignedUrls`) e `src/integrations/supabase/client.server.ts`; la opción A elimina esa dependencia y usa `getPublicUrl`.
- El despliegue en Lovable sigue funcionando con el preset Node; el cambio no rompe el entorno actual, pero se comprueba en el paso 4.
