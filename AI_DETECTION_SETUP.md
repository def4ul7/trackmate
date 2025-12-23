# TrackMate AI Detection Setup

## Overview
The camera section now includes AI-powered activity detection using LLaVA (Large Language and Vision Assistant) model running via Ollama.

## What It Detects
The AI can identify:
1. **Using phone** 📱 - Actively holding/using smartphone
2. **Working** 💻 - Using computer/laptop/keyboard
3. **Using phone while working** 📱💻 - Doing both simultaneously
4. **Sleeping** 😴 - Eyes closed, lying down, resting
5. **Eating** 🍽️ - Consuming food
6. **Drinking** 🥤 - Drinking beverages
7. **Other** 🤷 - Any other activity

## Requirements

### 1. Python
- Python 3.8 or higher
- Install required packages:
```bash
pip install flask pillow requests
```

### 2. Ollama
- Download and install Ollama from: https://ollama.ai
- Pull the LLaVA model:
```bash
ollama pull llava:7b
```

### 3. Start Ollama Server
Run Ollama in the background:
```bash
ollama serve
```

## How to Start

### Option 1: Using the batch file (Windows)
1. Double-click `start-ai-server.bat`
2. The Python Flask server will start on http://localhost:5000

### Option 2: Manual start
1. Open terminal/command prompt
2. Navigate to the trackmate folder:
```bash
cd a:\xampp\htdocs\trackmate
```

3. Start the Python server:
```bash
python model.py
```

## How to Use

1. **Start the Python AI server** (see above)
2. **Open TrackMate** in your browser
3. **Go to Camera section** (📷 icon in sidebar)
4. **Start the camera** (toggle the switch)
5. **Enable AI Activity Detection** (toggle "AI Activity Detection" in Detection Settings)
6. The AI will analyze frames every 10 seconds and display detected activity

## Configuration

### Change Analysis Interval
Edit `camera.js` line with `setInterval`:
```javascript
// Analyze frame every 10 seconds (change 10000 to desired milliseconds)
aiDetectionInterval = setInterval(() => {
    analyzeCurrentFrame();
}, 10000);
```

### Change Ollama Server Address
Edit `model.py` line 20:
```python
OLLAMA_API = "http://localhost:11433/api/generate"  # Change if Ollama runs elsewhere
```

### Change Image Quality
Edit `model.py` line 29 for resize dimensions:
```python
def resize_image_for_analysis(image_bytes, max_size=512):  # Change max_size
```

## Troubleshooting

### "Cannot connect to AI server"
- Make sure Python Flask server is running on port 5000
- Check if `start-ai-server.bat` is running or run `python model.py` manually

### "Timeout" or "Request took too long"
- Ollama server might not be running - start it with `ollama serve`
- Model might be loading for the first time (can take 1-2 minutes)
- Try reducing image size in `model.py`

### "Model not found"
- Install the model: `ollama pull llava:7b`
- Check available models: `ollama list`

### Detection not accurate
- Make sure lighting is good
- Camera should have clear view of the activity
- Try adjusting camera angle

## Architecture

```
Browser (camera.html + camera.js)
    ↓ captures frame
    ↓ sends to PHP
PHP API (analyze-activity.php)
    ↓ forwards request
    ↓ to Python
Python Flask Server (model.py)
    ↓ sends to Ollama
Ollama + LLaVA Model
    ↓ returns classification
    ↑ back through the chain
Browser displays result
```

## Performance Tips

1. **Reduce analysis frequency** - Analyzing every 10 seconds is a good balance
2. **Lower image resolution** - Smaller images process faster (320x240 is optimal)
3. **Use GPU** - If available, Ollama will use GPU for faster inference
4. **Close other apps** - LLaVA requires significant memory (4-8GB)

## API Endpoints

### PHP API: `/api/analyze-activity.php`
- Method: POST
- Body: `{ "image": "data:image/jpeg;base64,..." }`
- Returns: `{ "activity": "1. Using phone 📱", "timestamp": "2025-12-24T10:30:00" }`

### Python API: `http://localhost:5000/analyze`
- Method: POST
- Body: `{ "image": "base64_encoded_image" }`
- Returns: `{ "activity": "1. Using phone 📱", "timestamp": "2025-12-24T10:30:00" }`

### Python API: `http://localhost:5000/current_activity`
- Method: GET
- Returns: Last detected activity without triggering new analysis

## Notes

- First analysis may take 30-60 seconds as model loads into memory
- Subsequent analyses are faster (3-10 seconds typically)
- AI detection runs client-side camera feed → no video stored on server
- Only captures single frames for analysis
- Snapshots are saved only when you click "Capture" button
