@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 22 ou plus recent est necessaire.
  echo Installez Node.js puis relancez ce fichier.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installation initiale de SD Languages...
  call npm install
  if errorlevel 1 (
    echo L'installation a echoue. Consultez le message ci-dessus.
    pause
    exit /b 1
  )
)

if not exist "apps\web\dist\index.html" (
  echo Preparation de l'application...
  call npm run build
  if errorlevel 1 (
    echo La preparation a echoue. Consultez le message ci-dessus.
    pause
    exit /b 1
  )
)

start "SD Languages - serveur local" /min cmd /k "npm start"
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:8787"

echo SD Languages est lance. Gardez la fenetre du serveur ouverte pendant l'utilisation.
timeout /t 3 /nobreak >nul
