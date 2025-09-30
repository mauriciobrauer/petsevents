# 🚀 Guía de Despliegue en Vercel

## 📋 Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Asegúrate de que todos los archivos estén en el repositorio
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Desplegar Frontend

1. **Ir a [vercel.com](https://vercel.com)**
2. **Hacer login con GitHub**
3. **Crear nuevo proyecto**
4. **Configurar:**
   - **Framework Preset**: Vite
   - **Root Directory**: `/` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Desplegar Backend

1. **Crear nuevo proyecto en Vercel**
2. **Configurar:**
   - **Framework Preset**: Other
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
   - **Install Command**: `npm install`

### 4. Configurar Base de Datos

#### Opción A: Neon (Recomendado)
1. **Ir a [neon.tech](https://neon.tech)**
2. **Crear cuenta gratuita**
3. **Crear nueva base de datos**
4. **Copiar la URL de conexión**

#### Opción B: Supabase
1. **Ir a [supabase.com](https://supabase.com)**
2. **Crear cuenta gratuita**
3. **Crear nuevo proyecto**
4. **Ir a Settings > Database**
5. **Copiar la URL de conexión**

### 5. Configurar Variables de Entorno

#### Frontend (Vercel)
```
VITE_API_BASE_URL=https://tu-backend.vercel.app/api
```

#### Backend (Vercel)
```
NODE_ENV=production
DATABASE_URL=postgresql://usuario:password@host:puerto/database
PORT=3003
```

### 6. Inicializar Base de Datos

1. **Conectar a tu base de datos PostgreSQL**
2. **Ejecutar los scripts de inicialización:**

```sql
-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  instagram TEXT,
  about_me TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla pets
CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  description TEXT,
  image_url TEXT,
  owner_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users (id)
);

-- Crear tabla events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  max_attendees INTEGER DEFAULT 50,
  is_private BOOLEAN DEFAULT FALSE,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users (id)
);

-- Crear tabla reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Crear tabla event_pets
CREATE TABLE IF NOT EXISTS event_pets (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  pet_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events (id),
  FOREIGN KEY (pet_id) REFERENCES pets (id),
  UNIQUE(event_id, pet_id)
);
```

### 7. Poblar con Datos de Prueba

```sql
-- Insertar usuarios de prueba
INSERT INTO users (id, name, email, avatar_url, instagram, about_me) VALUES
('user-1', 'María García', 'maria@example.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '@maria_garcia', 'Amante de los perros y organizadora de eventos'),
('user-2', 'Carlos López', 'carlos@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '@carlos_lopez', 'Veterinario y amante de los gatos'),
('user-3', 'Ana Martínez', 'ana@example.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '@ana_martinez', 'Entrenadora de mascotas y organizadora de eventos');

-- Insertar mascotas de prueba
INSERT INTO pets (id, name, type, breed, age, description, image_url, owner_id) VALUES
('pet-1', 'Max', 'Perro', 'Golden Retriever', 3, 'Perro muy amigable y juguetón', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop', 'user-1'),
('pet-2', 'Luna', 'Gato', 'Siamés', 2, 'Gata cariñosa y tranquila', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop', 'user-2'),
('pet-3', 'Rocky', 'Perro', 'Bulldog Francés', 4, 'Perro divertido y enérgico', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop', 'user-3');

-- Insertar eventos de prueba
INSERT INTO events (id, title, description, date, time, location, max_attendees, is_private, created_by) VALUES
('event-1', 'Paseo en el Parque', 'Un paseo relajante por el parque central', '2024-10-15', '10:00', 'Parque Central', 20, false, 'user-1'),
('event-2', 'Fiesta de Disfraces', 'Fiesta temática para mascotas disfrazadas', '2024-10-20', '15:00', 'Centro Comunitario', 30, false, 'user-2'),
('event-3', 'Clase de Obediencia', 'Clase básica de obediencia para perros', '2024-10-25', '09:00', 'Campo de Entrenamiento', 15, true, 'user-3');
```

## 🔧 Solución de Problemas

### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` en el directorio correcto

### Error: "Database connection failed"
- Verifica la URL de conexión de la base de datos
- Asegúrate de que la base de datos esté accesible desde Vercel

### Error: "CORS policy"
- Verifica que las URLs de origen estén configuradas correctamente
- Asegúrate de que el frontend y backend estén en el mismo dominio o configurados para CORS

## 📊 Monitoreo

- **Vercel Dashboard**: Monitorea el rendimiento y logs
- **Base de Datos**: Monitorea el uso y rendimiento
- **Logs**: Revisa los logs de Vercel para errores

## 🚀 Próximos Pasos

1. **Configurar dominio personalizado**
2. **Implementar autenticación real**
3. **Agregar notificaciones push**
4. **Implementar cache**
5. **Agregar analytics**

---

¡Tu aplicación Pet Events estará lista para usar en producción! 🎉
