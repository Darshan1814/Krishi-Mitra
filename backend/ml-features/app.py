from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import base64
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001'], supports_credentials=True)

GEMINI_API_KEY = 'AIzaSyDrYXOmHqiChayrg_yC0i-aGi-OqeJw1v4'
GEMINI_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}'

@app.route('/api/disease-detection', methods=['POST'])
def disease_detection():
    try:
        # Handle file upload
        if 'image' in request.files:
            image_file = request.files['image']
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        else:
            return jsonify({'success': False, 'error': 'No image provided'})

        payload = {
            "contents": [{
                "parts": [
                    {
                        "text": """Analyze this plant image as an expert plant pathologist. Identify the plant and any diseases. Respond in this exact JSON format:

{
  "plant_identified": true,
  "plant_name": "actual plant name",
  "scientific_name": "scientific name",
  "disease_detected": true/false,
  "disease_name": "specific disease name or 'Healthy Plant'",
  "confidence": 0.85,
  "symptoms": "visible symptoms in detail",
  "treatment_solution": "specific treatment steps",
  "medicines": "recommended products for Indian farmers",
  "application_method": "how to apply",
  "timeline": "recovery time"
}

Be specific and accurate. If you cannot identify the plant or disease clearly, set confidence lower but still provide your best analysis."""
                    },
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_data
                        }
                    }
                ]
            }]
        }
        
        response = requests.post(GEMINI_URL, headers={'Content-Type': 'application/json'}, json=payload)
        result = response.json()
        
        if 'candidates' in result and result['candidates']:
            ai_response = result['candidates'][0]['content']['parts'][0]['text']
            
            # Extract JSON from response
            try:
                json_start = ai_response.find('{')
                json_end = ai_response.rfind('}') + 1
                if json_start != -1 and json_end != -1:
                    json_str = ai_response[json_start:json_end]
                    diagnosis_data = json.loads(json_str)
                    
                    return jsonify({
                        'success': True,
                        'prediction': diagnosis_data.get('disease_name', diagnosis_data.get('plant_name', 'Plant Analysis')),
                        'confidence': diagnosis_data.get('confidence', 0.80),
                        'analysis': ai_response,
                        'data': diagnosis_data
                    })
            except:
                pass
            
            # Fallback parsing if JSON extraction fails
            return jsonify({
                'success': True,
                'prediction': 'Plant Analysis Complete',
                'confidence': 0.75,
                'analysis': ai_response,
                'data': {
                    'plant_identified': True,
                    'plant_name': 'Plant Analyzed',
                    'disease_detected': 'disease' in ai_response.lower(),
                    'disease_name': 'See analysis below',
                    'symptoms': 'Check full analysis',
                    'treatment_solution': ai_response[:300] + '...',
                    'confidence': 0.75
                }
            })
        
        return jsonify({'success': False, 'error': 'Unable to analyze image'})
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/get-solution', methods=['POST'])
def get_solution():
    try:
        data = request.get_json()
        disease_name = data.get('disease_name', 'plant disease')
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"""Provide 6 specific treatment points for {disease_name} in Indian agriculture:

1. **Immediate Action**: [specific first step to take]
2. **Fungicide/Pesticide**: [specific product names available in India like Bavistin, Blitox, etc.]
3. **Application Method**: [exact method - spray, soil drench, etc.]
4. **Dosage & Timing**: [specific amounts per liter and frequency]
5. **Environmental Care**: [soil, water, sunlight management steps]
6. **Prevention**: [specific future prevention measures]

Make it practical for Indian farmers with locally available products and exact dosages."""
                }]
            }]
        }
        
        response = requests.post(GEMINI_URL, headers={'Content-Type': 'application/json'}, json=payload)
        result = response.json()
        
        if 'candidates' in result and result['candidates']:
            solution = result['candidates'][0]['content']['parts'][0]['text']
            return jsonify({'success': True, 'solution': solution})
        
        return jsonify({'success': False, 'error': 'Unable to get solution'})
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            schemes = []
            
            page.goto('https://www.myscheme.gov.in/search?q=farmer', wait_until='networkidle')
            page.wait_for_timeout(2000)
            
            links = page.query_selector_all('a')
            for link in links:
                try:
                    text = link.inner_text().strip()
                    href = link.get_attribute('href')
                    
                    if (len(text) > 10 and len(text) < 150 and 
                        any(keyword in text.lower() for keyword in ['farmer', 'kisan', 'krishi', 'agriculture', 'fasal', 'scheme', 'yojana'])):
                        
                        full_link = href if href and href.startswith('http') else f"https://www.myscheme.gov.in{href or ''}"
                        
                        schemes.append({
                            'title': text,
                            'description': 'Government scheme for farmers and agriculture',
                            'link': full_link
                        })
                except:
                    continue
            
            browser.close()
            
            seen = set()
            unique_schemes = []
            for scheme in schemes:
                if scheme['title'] not in seen and len(scheme['title']) > 5:
                    seen.add(scheme['title'])
                    unique_schemes.append(scheme)
            
            return jsonify({'schemes': unique_schemes[:20]})
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch live data: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)