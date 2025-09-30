@echo off
echo 🐾 Iniciando Pet Events Web App...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js primero.
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala npm primero.
    pause
    exit /b 1
)

echo ✅ Node.js y npm están instalados
echo.

REM Instalar dependencias del frontend si no existen
if not exist "node_modules" (
    echo 📦 Instalando dependencias del frontend...
    npm install
    echo.
)

REM Instalar dependencias del backend si no existen
if not exist "backend\node_modules" (
    echo 📦 Instalando dependencias del backend...
    cd backend
    npm install
    cd ..
    echo.
)

REM Poblar la base de datos si no existe
if not exist "backend\database\pet_events.db" (
    echo 🗄️ Poblando base de datos con datos de ejemplo...
    cd backend
    npm run seed
    cd ..
    echo.
)

echo 🚀 Iniciando servidores...
echo.

REM Iniciar backend en una nueva ventana
echo 🔧 Iniciando backend (puerto 3001)...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Esperar un poco para que el backend se inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en una nueva ventana
echo 🎨 Iniciando frontend (puerto 3000)...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ ¡Aplicación iniciada correctamente!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001
echo ❤️ Health Check: http://localhost:3001/api/health
echo.
echo Las ventanas de los servidores se abrirán automáticamente.
echo Cierra las ventanas de los servidores para detener la aplicación.
echo.
pause
