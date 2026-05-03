@echo off
setlocal

set "URL=http://127.0.0.1:5174/"
set "APP_DIR=%~dp0starter"

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -Uri '%URL%' -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200) { exit 0 } } catch { exit 1 }"

if errorlevel 1 (
  cd /d "%APP_DIR%"
  start "Joseon Trade Dev Server" cmd /k npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
  timeout /t 3 /nobreak >nul
)

start "" "%URL%"
endlocal
