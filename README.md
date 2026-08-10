# GDinamy

Aplicación de escritorio para gestionar copias de seguridad **completas y parciales** de bases de datos MongoDB. Está construida con Tauri + Vue 3 + Vuetify + Pinia, y embebe los binarios oficiales de **MongoDB Database Tools** (`mongodump`, `mongorestore`, `mongoexport`, `mongoimport`) — no requiere tener MongoDB Database Tools instalado aparte en el sistema.

## Funcionalidades

- **Conexiones**: guardar, editar, eliminar y probar perfiles de conexión a MongoDB.
- **Respaldos**: completos (una base o todas) o parciales (colecciones específicas, con filtro JSON opcional por colección), con consola de progreso en vivo.
- **Restauración**: desde una carpeta de respaldo, completa o restringida a ciertos `baseDatos.coleccion`, con opción de `--drop`.
- **Historial**: registro automático de cada respaldo/restauración (fecha, tipo, duración, estado), con borrado individual o vaciado completo.

## Prerrequisitos

| Herramienta | Notas |
|---|---|
| [Node.js](https://nodejs.org/) 20+ y npm | Para el frontend (Vite) |
| [Rust](https://www.rust-lang.org/tools/install) (`rustup`) | Para compilar el backend de Tauri |
| Dependencias del sistema de Tauri v2 | Ver [tauri.app/start/prerequisites](https://v2.tauri.app/start/prerequisites/) |

En **Linux** (Debian/Ubuntu/WSL2) instala además:

```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  pkg-config libdbus-1-dev
```

En **Windows** necesitas Visual Studio Build Tools (carga de trabajo "Desarrollo para el escritorio con C++") y el runtime de WebView2 (ya viene instalado en Windows 10/11 actualizados).

## Instalación

```bash
npm install
```

Los binarios de MongoDB Database Tools **no están versionados en el repo** (ver `.gitignore`). Descárgalos antes de compilar o ejecutar la app:

```bash
./scripts/download-database-tools.sh
```

Esto coloca `mongodump`/`mongorestore`/`mongoexport`/`mongoimport` para Linux y Windows en `src-tauri/binaries/`. Para actualizar la versión, definí la variable de entorno antes de correr el script:

```bash
MONGODB_TOOLS_VERSION=100.15.0 ./scripts/download-database-tools.sh
```

## Desarrollo

```bash
npm run tauri dev
```

Levanta el servidor de Vite y compila/ejecuta el backend de Rust en modo desarrollo, con recarga en caliente del frontend.

> **Nota WSL2**: si tu MongoDB corre en Windows y desarrollas dentro de WSL2, `localhost` en la URI de conexión apunta al propio WSL2, no a Windows. Usa la IP del gateway (`ip route show | grep default`) en su lugar, y asegúrate de que `mongod.cfg` tenga `bindIp: 0.0.0.0` (o incluya esa IP) y que el Firewall de Windows permita el puerto 27017 desde la interfaz `vEthernet (WSL)`. Al correr la app ya compilada directamente en Windows, `localhost` funciona normalmente.

## Uso

1. **Conexiones** → "Nueva conexión": ingresa un nombre y la URI (`mongodb://usuario:contraseña@host:puerto/?authSource=admin`). Usa el ícono de conexión para probarla.
2. **Respaldos**: elige la conexión, el tipo (Completo/Parcial), la base de datos (y colecciones + filtro JSON si es parcial), y la carpeta destino. "Iniciar respaldo" muestra el progreso en vivo.
3. **Restauración**: elige la conexión destino, la carpeta del respaldo a restaurar, opcionalmente los espacios de nombres (`baseDatos.coleccion`, uno por línea) a restaurar y si se debe hacer `--drop` antes.
4. **Historial**: lista de todas las operaciones realizadas, con su estado y duración; permite borrar entradas individuales o vaciar todo el historial.

Los perfiles de conexión y el historial se guardan localmente en el directorio de datos de la app (vía `@tauri-apps/plugin-store`), no en la nube.

## Build

```bash
npm run tauri build
```

Genera el instalador para la plataforma actual (`.deb`/`.AppImage` en Linux, `.msi`/`.exe` NSIS en Windows) en `src-tauri/target/release/bundle/`. Recuerda correr `scripts/download-database-tools.sh` para la plataforma de destino antes de compilar (los binarios de Database Tools deben existir en `src-tauri/binaries/` para esa plataforma).

## Lint

```bash
npx eslint .
```

## Estructura del proyecto

```
src/
├── api/            # Wrapper de invoke() de Tauri
├── components/      # Componentes Vue por feature (cada una con su Index.vue)
├── composables/      # Funciones use* (ej. escuchar progreso de sidecars)
├── plugins/          # Registro de Vuetify/Router/Pinia
├── router/           # Rutas estáticas
├── services/          # Llamadas a comandos Tauri y al plugin-store, por dominio
├── stores/            # Stores Pinia (Options API)
└── utils/             # Formateo de fechas, bytes, validación de JSON

src-tauri/
├── binaries/          # Binarios de MongoDB Database Tools (no versionados)
├── capabilities/       # Permisos de Tauri (scoped a los 4 sidecars)
└── src/
    ├── commands/        # Comandos Tauri (conexión, respaldo, restauración)
    ├── mongo/            # Cliente cacheado del driver oficial de MongoDB
    └── sidecar/           # Ejecución de sidecars + archivos de config temporales
```
