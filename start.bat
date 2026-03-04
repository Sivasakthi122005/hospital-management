
@echo off
title Hospital Management System
color 0A

echo.
echo  ==========================================
echo   HOSPITAL MANAGEMENT SYSTEM - STARTING
echo  ==========================================
echo.

:: Kill anything running on port 5000
echo  Stopping any process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul

:: Start the server
echo  Starting server...
echo.
start "" http://localhost:5000/login.html
node server.js

pause
