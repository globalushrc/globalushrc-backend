@echo off
echo Starting Global US HRC Development Environment...

start "Backend Server" cmd /k "cd backend && npm run start"
start "Frontend Application" cmd /k "cd frontend && npm run dev"

echo Servers started in separate windows.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
pause
