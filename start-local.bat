@echo off
echo Starting Flostat Local Development Environment

echo.
echo 1. Starting backend server...
cd server
start "Backend Server" cmd /k "npm start"

echo.
echo 2. Starting frontend development server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Local development environment started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:4000
echo DynamoDB Local: http://localhost:8000
pause