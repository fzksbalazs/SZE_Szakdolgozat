@echo off
echo ==== WEARABLE PROJECT - ALL SERVICES STARTING ====
echo.

REM --- ADMIN ---
start "admin" cmd /k "cd /d D:\SZE_Szakdolgozat\admin && npm install && npm start"

REM --- FRONTEND ---
start "frontend" cmd /k "cd /d D:\SZE_Szakdolgozat\frontend && npm install && npm start"

REM --- BACKEND ---
start "backend" cmd /k "cd /d D:\SZE_Szakdolgozat\backend && npm install && npm run start-server"

REM --- TSHIRT CLIENT ---
start "tshirt_client" cmd /k "cd /d D:\SZE_Szakdolgozat\tshirt_designer\client && npm install && npm run dev"

REM --- TSHIRT NODE SERVER ---
start "tshirt_server" cmd /k "cd /d D:\SZE_Szakdolgozat\tshirt_designer\server && npm install && npm start"

REM --- PYTHON FASTAPI SERVER ---
start "python_api" cmd /k "cd /d D:\SZE_Szakdolgozat\tshirt_designer && .venv\Scripts\activate && cd server\python && uvicorn app:app --host 0.0.0.0 --port 8000"


echo.
echo ==== ALL SERVICES STARTED! ====
pause
