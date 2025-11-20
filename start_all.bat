@echo off
echo ==== WEARABLE PROJECT - ALL SERVICES STARTING ====
echo.

REM 
cd /d "%~dp0"

REM --- ADMIN ---
start "admin" cmd /k "cd admin && npm install && npm start"

REM --- FRONTEND ---
start "frontend" cmd /k "cd frontend && npm install && npm start"

REM --- BACKEND ---
start "backend" cmd /k "cd backend && npm install && npm run start-server"

REM --- TSHIRT CLIENT ---
start "tshirt_client" cmd /k "cd tshirt_designer\client && npm install && npm run dev"

REM --- TSHIRT NODE SERVER ---
start "tshirt_server" cmd /k "cd tshirt_designer\server && npm install && npm start"

REM --- PYTHON FASTAPI SERVER ---
start "python_api" cmd /k ^
"cd tshirt_designer\server\python && ^
IF NOT EXIST .venv ( ^
    echo Creating Python virtual environment... && ^
    python -m venv .venv ^
) && ^
call .venv\Scripts\activate && ^
pip install --upgrade pip && ^
IF EXIST requirements.txt ( ^
    echo Installing Python dependencies... && ^
    pip install -r requirements.txt ^
) ELSE ( ^
    echo WARNING: requirements.txt not found! ^
) && ^
echo Starting AI server... && ^
uvicorn app:app --host 0.0.0.0 --port 8000"

echo.
echo ==== ALL SERVICES STARTED! ====
pause