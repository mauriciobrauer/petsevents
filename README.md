# 🐾 Pet Events Web App

Una aplicación web para organizar y gestionar eventos para mascotas, construida con React, Node.js y Express.

## 🚀 Características

- **Gestión de Eventos**: Crear, editar y ver eventos para mascotas
- **Perfiles de Mascotas**: Gestionar información de mascotas
- **Sistema de Usuarios**: Autenticación y perfiles de usuario
- **Reseñas**: Sistema de calificaciones para eventos
- **Interfaz Responsiva**: Diseño moderno con Tailwind CSS

## 🛠️ Tecnologías

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide React

### Backend
- Node.js
- Express
- SQLite (desarrollo) / PostgreSQL (producción)
- CORS
- Multer (upload de archivos)

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd pet-events-web-app
   ```

2. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

3. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```

5. **Inicializar la base de datos**
   ```bash
   cd backend
   npm run seed
   cd ..
   ```

6. **Ejecutar en modo desarrollo**
   ```bash
   # Terminal 1: Backend
   cd backend && npm start
   
   # Terminal 2: Frontend
   npm run dev
   ```

7. **Abrir la aplicación**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3003

## 🌐 Despliegue en Vercel

### Opción 1: Despliegue Automático (Recomendado)

1. **Subir a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Desplegar Frontend en Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Conectar tu repositorio de GitHub
   - Configurar:
     - **Framework Preset**: Vite
     - **Root Directory**: `/` (raíz del proyecto)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Desplegar Backend en Vercel**
   - Crear un nuevo proyecto en Vercel
   - Configurar:
     - **Framework Preset**: Other
     - **Root Directory**: `/backend`
     - **Build Command**: `npm install`
     - **Output Directory**: `.`
     - **Install Command**: `npm install`

4. **Configurar Base de Datos**
   - Usar [Neon](https://neon.tech) o [Supabase](https://supabase.com) para PostgreSQL
   - Agregar la URL de conexión como variable de entorno `DATABASE_URL`

### Opción 2: Despliegue Manual

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Desplegar Frontend**
   ```bash
   vercel --prod
   ```

3. **Desplegar Backend**
   ```bash
   cd backend
   vercel --prod
   ```

## 🔧 Variables de Entorno

### Frontend (.env)
```env
VITE_API_BASE_URL=https://tu-backend.vercel.app/api
```

### Backend
```env
NODE_ENV=production
DATABASE_URL=postgresql://usuario:password@host:puerto/database
PORT=3003
```

## 📁 Estructura del Proyecto

```
pet-events-web-app/
├── src/                    # Código fuente del frontend
│   ├── components/         # Componentes React
│   ├── services/          # Servicios API
│   ├── hooks/             # Custom hooks
│   └── App.tsx            # Componente principal
├── backend/               # Código del backend
│   ├── routes/            # Rutas de la API
│   ├── database/          # Configuración de BD
│   ├── scripts/           # Scripts de inicialización
│   └── server.js          # Servidor principal
├── vercel.json            # Configuración de Vercel
└── package.json           # Dependencias del frontend
```

## 🚀 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build

### Backend
- `npm start` - Iniciar servidor
- `npm run dev` - Servidor de desarrollo con nodemon
- `npm run seed` - Poblar base de datos con datos de prueba

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

¡Disfruta organizando eventos para mascotas! 🐕🐱🐰# Force redeploy Wed Oct  1 11:13:29 CST 2025
# Test deployment Wed Oct  1 11:25:50 CST 2025
