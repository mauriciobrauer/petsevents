#!/bin/bash

echo "🐾 Iniciando Pet Events Web App..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

echo "✅ Node.js y npm están instalados"
echo ""

# Instalar dependencias del frontend si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
    echo ""
fi

# Instalar dependencias del backend si no existen
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd backend
    npm install
    cd ..
    echo ""
fi

# Poblar la base de datos si no existe
if [ ! -f "backend/database/pet_events.db" ]; then
    echo "🗄️ Poblando base de datos con datos de ejemplo..."
    cd backend
    npm run seed
    cd ..
    echo ""
fi

echo "🚀 Iniciando servidores..."
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Configurar trap para limpiar procesos
trap cleanup SIGINT SIGTERM

# Iniciar backend en background
echo "🔧 Iniciando backend (puerto 3001)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar frontend en background
echo "🎨 Iniciando frontend (puerto 3000)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ ¡Aplicación iniciada correctamente!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "❤️ Health Check: http://localhost:3001/api/health"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"
echo ""

# Esperar a que los procesos terminen
wait $BACKEND_PID $FRONTEND_PID
