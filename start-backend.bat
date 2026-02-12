@echo off
REM Turbo Wind Intelligence Portal - Backend Startup Script

echo ========================================
echo   Turbo Wind Intelligence Portal
echo   Starting Backend Server...
echo ========================================
echo.

REM Set JAVA_HOME
for /f "tokens=*" %%i in ('where java') do set JAVA_PATH=%%i
for %%i in ("%JAVA_PATH%") do set JAVA_BIN=%%~dpi
for %%i in ("%JAVA_BIN%..") do set JAVA_HOME=%%~fi

echo JAVA_HOME set to: %JAVA_HOME%
echo.

REM Set Maven
set M2_HOME=C:\maven\apache-maven-3.9.6
set PATH=%M2_HOME%\bin;%PATH%

echo Maven Home: %M2_HOME%
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

echo Building and starting application...
echo This may take a few minutes on first run...
echo.

REM Run Maven
"%M2_HOME%\bin\mvn.cmd" spring-boot:run

pause
