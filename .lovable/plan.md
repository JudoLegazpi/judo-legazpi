# Despliegue en hosting Node.js (LucusHost)

## Situación actual

La app está construida con TanStack Start y **compila por defecto para Cloudflare Workers** (no para Node.js clásico). Tal como está en GitHub, **no arrancaría directamente** en un hosting Node.js tipo LucusHost sin un pequeño ajuste. La base de datos y el almacenamiento de imágenes/documentos seguirían en la nube de Lovable, accesibles desde cualquier hosting vía API.

## Qué hay que cambiar (poco)

### 1. Cambiar el destino de compilación a Node.js
En `vite.config.ts`, indicar el preset `node-server` de Nitro en lugar del de Cloudflare. Así `npm run build` generará un servidor Node estándar en `.output/server/index.mjs`, que es lo que espera LucusHost (cPanel → "Setup Node.js App" / Passenger).

### 2. Añadir script de arranque
En `package.json`, añadir:
```json
"start": "node .output/server/index.mjs"
```
LucusHost usará ese archivo como punto de entrada de la aplicación.

### 3. Documentar las variables de entorno necesarias
Crear un archivo `.env.example` con las variables que hay que configurar en el panel de LucusHost:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (necesaria para firmar las URLs de las imágenes privadas)
- Las mismas con prefijo `VITE_` para el navegador.

### 4. Requisito de versión
La app necesita **Node.js 20 o superior** en el hosting (comprobar que el plan de LucusHost permite elegir esa versión).

## Avisos importantes

1. **La clave de servicio (`SUPABASE_SERVICE_ROLE_KEY`)**: Lovable Cloud no la muestra en la interfaz. Se usa para firmar los enlaces temporales de las imágenes. Para el despliegue propio habría dos opciones:
   - Pedir esa clave a soporte de Lovable Cloud, o
   - Simplificar el sistema de imágenes para que no necesite firma (hacer público el bucket de medios). Recomiendo la primera; si no es posible, preparo la segunda como alternativa.
2. **Construir fuera del hosting**: los hosting compartidos Node suelen tener poca memoria para compilar. Lo recomendable es compilar en local o con GitHub Actions y subir solo la carpeta `.output` más `package.json`. Puedo dejar preparado un flujo de GitHub Actions que genere el paquete listo para subir.
3. **El panel de administración y el login seguirán funcionando** contra la misma base de datos, sin cambios.
4. **La URL de la app cambiará**: habrá que añadir el nuevo dominio a las URLs permitidas de autenticación (lo puedo ajustar yo desde aquí cuando tengas el dominio).

## Pasos de ejecución (tras aprobar)

1. Ajustar `vite.config.ts` (preset `node-server`) y `package.json` (script `start`).
2. Compilar y verificar que `.output/server/index.mjs` arranca correctamente con Node.
3. Crear `.env.example` y una guía corta `DESPLIEGUE.md` con los pasos exactos para LucusHost (variables, entry point, Node 20+).
4. (Opcional) GitHub Action que genere el paquete de despliegue automáticamente en cada push.

## Detalle técnico

- Cambio en `vite.config.ts`: `defineConfig({ tanstackStart: { server: { entry: "server" } }, nitro: { preset: "node-server" } })` — se mantiene la entrada SSR personalizada `src/server.ts`.
- La compilación de producción se verifica ejecutando `node .output/server/index.mjs` con las variables de entorno de prueba y comprobando una respuesta 200 de la portada y de una página en euskera.
- El despliegue en Lovable seguirá funcionando igual; el cambio es compatible con ambos destinos.
