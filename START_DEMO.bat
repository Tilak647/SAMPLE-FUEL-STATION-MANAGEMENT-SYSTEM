@echo off
color 0A
echo =======================================================
echo     SMART FUEL STATION MANAGEMENT SYSTEM - DEMO MODE
echo =======================================================
echo.
echo Starting Backend Server (Spring Boot)...
start cmd /k "title Backend Server && cd backend && mvn spring-boot:run"

echo Starting Frontend Server (React)...
start cmd /k "title Frontend Server && cd Frontend && npm start"

echo.
echo Both servers are booting up in separate windows!
echo Please wait about 30-45 seconds for everything to load.
echo.
echo IMPORTANT: The Simulation Mode is active!
echo Once the backend boots, wait 2 minutes, and you will see
echo virtual customer sales appear automatically on the dashboard.
echo.
pause
