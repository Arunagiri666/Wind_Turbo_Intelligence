@echo off
REM Turbo Wind Intelligence Portal - Frontend Startup Script

echo ========================================
echo   Turbo Wind Intelligence Portal
echo   Starting Frontend Server...
echo ========================================
echo.

REM Navigate to frontend directory
cd /d "%~dp0frontend"

echo Starting Python HTTP Server on port 3000...
echo.
echo Open your browser to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 3000

pause
