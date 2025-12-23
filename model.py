    #!/usr/bin/env python3
"""
Webcam Activity Detection using LLaVA and Ollama
A Flask web server that uses client-side webcam and LLaVA AI to classify user activities.
"""

import os
import base64
import io
from flask import Flask, render_template, Response, jsonify, request
import requests
from PIL import Image
import json
from datetime import datetime
import re

app = Flask(__name__)

# Ollama API endpoint - Change this if your Ollama runs on different host/port
OLLAMA_API = "http://localhost:11434/api/generate"
MODEL_NAME = "llava:7b"

# Timeout settings
REQUEST_TIMEOUT = 180  # seconds

# Global variables
current_activity = "Starting up..."
last_analysis_time = None


def resize_image_for_analysis(image_bytes, max_size=512):
    """Resize image to reduce processing time."""
    try:
        # Open image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Calculate new size maintaining aspect ratio
        width, height = image.size
        if max(width, height) > max_size:
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Convert back to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG', quality=85)
        return img_byte_arr.getvalue()
    except Exception as e:
        print(f"Error resizing image: {e}")
        return image_bytes


def analyze_image_with_llava(image_bytes):
    """Send image to LLaVA via Ollama and classify the activity."""
    try:
        # Resize image to speed up processing
        resized_image = resize_image_for_analysis(image_bytes, max_size=320)
        
        # Convert image bytes to base64
        image_base64 = base64.b64encode(resized_image).decode('utf-8')
        
        # Enhanced prompt for better accuracy with direct classification request
        prompt = """Look at this image and classify what the person is doing. Choose ONE of these categories:

1. Using phone - actively HOLDING/USING a smartphone in their hands, looking at it
2. Working - using computer/laptop/keyboard, at desk working
3. Using phone while working - doing BOTH: person is ACTIVELY HOLDING and USING phone in their hand AND working at computer/desk
4. Sleeping - eyes closed, lying down, resting in bed
5. Eating - consuming food, holding utensils or food items
6. Drinking - holding cup/glass/bottle, drinking beverages
7. Other - anything else

CRITICAL RULES:
- For categories 1 or 3: Person MUST be ACTIVELY HOLDING the phone in their hand(s)
- If phone is just sitting on desk/table (not in hands), DO NOT choose 1 or 3
- If phone is nearby but person is not holding it, choose category 2 (Working) or 7 (Other)
- Look at their HANDS specifically - are they gripping/holding a phone right now?
- Category 3 requires BOTH: phone in hand AND computer/desk visible

First state the category number (1-7), then briefly explain what you see, specifically mentioning if phone is in hands or just on desk."""
        
        # Prepare the request payload with streaming enabled
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "images": [image_base64],
            "stream": True
        }
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Sending request to Ollama...")
        print(f"Image size: {len(resized_image)} bytes")
        
        # Send request to Ollama with streaming
        response = requests.post(OLLAMA_API, json=payload, timeout=REQUEST_TIMEOUT, stream=True)
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Got response status: {response.status_code}")
        
        if response.status_code == 200:
            # Collect the streaming response
            full_response = ""
            line_count = 0
            for line in response.iter_lines():
                if line:
                    line_count += 1
                    try:
                        json_response = json.loads(line)
                        if 'response' in json_response:
                            full_response += json_response['response']
                            print(f"Chunk {line_count}: {json_response['response'][:30]}...")
                        if 'error' in json_response:
                            print(f"ERROR in response: {json_response['error']}")
                            return f"Ollama Error: {json_response['error']}"
                        if json_response.get('done', False):
                            print(f"Response complete after {line_count} chunks")
                            break
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error: {e}, Line: {line[:100]}")
                        continue
            
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Full response length: {len(full_response)} chars")
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Full response: {full_response}")
            
            # Clean up the response
            if not full_response or full_response.strip() == "":
                return "⚠️ No response from AI. Model may not support vision or took too long."
            
            result = full_response.strip()
            result_lower = result.lower()
            
            # First, check if response starts with a number (1-7)
            number_match = re.match(r'^\s*(\d+)', result)
            if number_match:
                number = int(number_match.group(1))
                if number == 1:
                    return "1. Using phone 📱"
                elif number == 2:
                    return "2. Working 💻"
                elif number == 3:
                    return "3. Using phone while working 📱💻"
                elif number == 4:
                    return "4. Sleeping 😴"
                elif number == 5:
                    return "5. Eating 🍽️"
                elif number == 6:
                    return "6. Drinking 🥤"
                elif number == 7:
                    return "7. Other 🤷"
            
            # Advanced keyword matching with priority for combined activities
            # Strict phone detection - must be actively holding/using, not just nearby
            has_phone = (
                ('holding' in result_lower and ('phone' in result_lower or 'mobile' in result_lower or 'smartphone' in result_lower)) or
                ('hand' in result_lower and ('phone' in result_lower or 'mobile' in result_lower or 'smartphone' in result_lower)) or
                ('using' in result_lower and ('phone' in result_lower or 'mobile' in result_lower or 'smartphone' in result_lower)) or
                'texting' in result_lower or
                'calling' in result_lower or
                ('looking at' in result_lower and ('phone' in result_lower or 'mobile' in result_lower or 'smartphone' in result_lower)) or
                'phone in hand' in result_lower or
                'holding phone' in result_lower
            )
            
            # Exclude if phone is just on desk/table (not being used)
            phone_not_in_use = (
                'phone on' in result_lower or
                'phone is on' in result_lower or
                'phone sits' in result_lower or
                'phone lying' in result_lower or
                'phone placed' in result_lower or
                ('phone' in result_lower and 'desk' in result_lower and 'not' in result_lower) or
                ('phone' in result_lower and 'table' in result_lower and 'not' in result_lower)
            )
            
            if phone_not_in_use:
                has_phone = False
            
            # Expanded work detection keywords
            has_work = (
                'work' in result_lower or 
                'computer' in result_lower or 
                'laptop' in result_lower or 
                'typing' in result_lower or 
                'desk' in result_lower or 
                'keyboard' in result_lower or 
                'screen' in result_lower and 'computer' in result_lower or  # Computer screen specifically
                'monitor' in result_lower or
                'office' in result_lower or
                'working' in result_lower or
                'pc' in result_lower or
                'macbook' in result_lower
            )
            
            # Check for phone + computer/work combination first (highest priority)
            if has_phone and has_work:
                return "3. Using phone while working 📱💻"
            
            # Single activity detection
            if has_phone:
                return "1. Using phone 📱"
            elif has_work:
                return "2. Working 💻"
            elif 'sleep' in result_lower or 'resting' in result_lower or 'lying' in result_lower or 'bed' in result_lower or 'nap' in result_lower or 'eyes closed' in result_lower:
                return "4. Sleeping 😴"
            elif 'eat' in result_lower or 'food' in result_lower or 'meal' in result_lower or 'bite' in result_lower or 'chew' in result_lower or 'fork' in result_lower or 'spoon' in result_lower:
                return "5. Eating 🍽️"
            elif 'drink' in result_lower or 'beverage' in result_lower or 'cup' in result_lower or 'water' in result_lower or 'coffee' in result_lower or 'tea' in result_lower or 'bottle' in result_lower or 'glass' in result_lower or 'sip' in result_lower:
                return "6. Drinking 🥤"
            # Additional phone detection from context clues
            elif ('hand' in result_lower and 'screen' in result_lower) or ('looking down' in result_lower and 'hand' in result_lower):
                # Person holding screen in hand and looking at it - likely phone
                return "1. Using phone 📱"
            elif 'sitt' in result_lower or 'stand' in result_lower or 'look' in result_lower or 'face' in result_lower or 'person' in result_lower or 'watch' in result_lower:
                # If it just describes the person but no specific activity
                return f"7. Other 🤷 - {result[:50]}"
            else:
                return f"7. Other 🤷 ({result[:100]})"
        else:
            return f"Error: API returned status {response.status_code}"
            
    except requests.exceptions.Timeout:
        return "⏱️ Timeout: Request took too long. Try again."
    except requests.exceptions.ConnectionError:
        return "❌ Cannot connect to Ollama server. Check connection."
    except Exception as e:
        print(f"Error: {e}")
        return f"Error: {str(e)}"


@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    """Receive image from client browser and analyze with LLaVA."""
    global current_activity, last_analysis_time
    
    try:
        # Get the image data from the request
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'activity': 'Error: No image data received',
                'timestamp': datetime.now().isoformat()
            })
        
        # Extract base64 image data (remove data:image/jpeg;base64, prefix if present)
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_data)
        
        # Analyze the image
        activity = analyze_image_with_llava(image_bytes)
        current_activity = activity
        last_analysis_time = datetime.now()
        
        return jsonify({
            'activity': activity,
            'timestamp': last_analysis_time.isoformat()
        })
        
    except Exception as e:
        print(f"Error in analyze route: {e}")
        return jsonify({
            'activity': f'Error: {str(e)}',
            'timestamp': datetime.now().isoformat()
        })


@app.route('/current_activity')
def get_current_activity():
    """Get the current activity without triggering new analysis."""
    return jsonify({
        'activity': current_activity,
        'timestamp': last_analysis_time.isoformat() if last_analysis_time else None
    })


if __name__ == '__main__':
    print("Starting Webcam Activity Detection Server...")
    print(f"Using Ollama model: {MODEL_NAME}")
    print("Open http://localhost:5000 in your browser")
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
