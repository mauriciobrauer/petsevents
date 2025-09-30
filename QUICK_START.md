# 🚀 Inicio Rápido - Pet Events Web App

## Opción 1: Script Automático (Recomendado)

### En macOS/Linux:
```bash
./start.sh
```

### En Windows:
```bash
start.bat
```

## Opción 2: Manual

### 1. Instalar dependencias
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Poblar base de datos
```bash
cd backend
npm run seed
cd ..
```

### 3. Ejecutar servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🌐 Acceso

- **Aplicación**: http://localhost:3000
- **API**: http://localhost:3003
- **Health Check**: http://localhost:3003/api/health

## ✅ Verificación

1. Abre http://localhost:3000
2. Deberías ver la pantalla de login
3. Haz clic en "Iniciar Sesión" para acceder
4. Verás una lista de eventos con datos de ejemplo

## 🐛 Problemas Comunes

**Error de puerto ocupado:**
- Cambia el puerto en `vite.config.ts` (frontend)
- Cambia el puerto en `backend/server.js` (backend)

**Error de base de datos:**
```bash
cd backend
rm database/pet_events.db
npm run seed
```

**Error de CORS:**
- Verifica que el backend esté en puerto 3001
- Verifica que el frontend esté en puerto 3000

## 📱 Funcionalidades Disponibles

- ✅ Ver lista de eventos
- ✅ Crear nuevos eventos
- ✅ Ver detalles de eventos
- ✅ Ver perfiles de mascotas
- ✅ Calendario de eventos
- ✅ Galería de fotos
- ✅ Sistema de reseñas

¡Disfruta explorando la aplicación! 🐾
