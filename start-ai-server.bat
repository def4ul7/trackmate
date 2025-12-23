@echo off
echo ========================================
echo   TrackMate AI Detection Server
echo ========================================
echo.
echo Starting Python Flask server with LLaVA AI model...
echo.
echo Make sure:
echo 1. Python is installed
echo 2. Ollama is running with llava:7b model
echo 3. Flask is installed (pip install flask pillow requests)
echo.
echo Server will run on http://localhost:5000
echo.

cd /d "%~dp0"
python model.py

pause
