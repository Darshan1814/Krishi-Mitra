const GEMINI_API_KEY = 'AIzaSyDrYXOmHqiChayrg_yC0i-aGi-OqeJw1v4';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File || file instanceof Blob)) {
      reject(new Error('Invalid file type'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const identifyPlant = async (image) => {
  try {
    if (!image) {
      throw new Error('No image provided');
    }
    
    let imageData;
    
    if (typeof image === 'string') {
      // Handle base64 string from camera capture
      imageData = image.includes(',') ? image.split(',')[1] : image;
    } else {
      // Handle File object from upload
      const base64 = await convertToBase64(image);
      imageData = base64.split(',')[1];
    }

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `You are an expert plant pathologist. Analyze this plant image and identify the plant species and any diseases. Respond ONLY with this JSON format:

{
  "plant_identified": true,
  "plant_name": "exact common name",
  "scientific_name": "scientific name",
  "plant_type": "crop/tree/shrub/herb",
  "disease_detected": true/false,
  "disease_name": "specific disease name or 'Healthy Plant'",
  "confidence": 0.85,
  "symptoms": "detailed visible symptoms",
  "treatment_solution": "specific treatment for Indian farmers",
  "medicines": "Indian agricultural products like Bavistin, Blitox etc",
  "care_instructions": "preventive care tips"
}

Be accurate and specific for Indian agriculture.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData
              }
            }
          ]
        }]
      })
    });

    const result = await response.json();
    
    if (result.candidates?.[0]) {
      const text = result.candidates[0].content.parts[0].text;
      
      try {
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const jsonData = JSON.parse(text.substring(jsonStart, jsonEnd));
        
        return {
          success: true,
          prediction: jsonData.disease_detected ? jsonData.disease_name : jsonData.plant_name,
          confidence: jsonData.confidence || 0.8,
          analysis: text,
          data: {
            identification: {
              common_name: jsonData.plant_name,
              scientific_name: jsonData.scientific_name,
              type: jsonData.plant_type,
              confidence: jsonData.confidence || 0.8
            },
            health_assessment: {
              status: jsonData.disease_detected ? 'Disease Detected' : 'Good',
              diseases: jsonData.disease_detected ? [jsonData.disease_name] : [],
              treatment: jsonData.treatment_solution
            },
            care_recommendations: {
              watering: jsonData.care_instructions || 'Regular watering as needed',
              fertilizer: jsonData.medicines || 'Standard fertilizer',
              pest_control: 'Monitor regularly for pests'
            }
          }
        };
      } catch {
        return {
          success: true,
          prediction: 'Plant Analysis Complete',
          confidence: 0.75,
          analysis: text,
          data: {
            identification: {
              common_name: 'Plant Analyzed',
              scientific_name: 'Analysis Complete',
              type: 'Plant',
              confidence: 0.75
            },
            health_assessment: {
              status: text.toLowerCase().includes('disease') ? 'Disease Detected' : 'Good',
              diseases: text.toLowerCase().includes('disease') ? ['See analysis'] : [],
              treatment: text.substring(0, 200) + '...'
            },
            care_recommendations: {
              watering: 'Regular watering as needed',
              fertilizer: 'Standard fertilizer',
              pest_control: 'Monitor regularly for pests'
            }
          }
        };
      }
    }
    
    throw new Error('No response from AI');
  } catch (error) {
    return {
      success: false,
      error: 'Unable to analyze plant image: ' + error.message
    };
  }
};

export const detectDisease = async (image) => {
  return await identifyPlant(image);
};

export const getSolution = async (diseaseName) => {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Provide 6 specific treatment points for ${diseaseName} in Indian agriculture:

1. **Immediate Action**: [specific first step]
2. **Fungicide/Pesticide**: [Indian products like Bavistin, Blitox]
3. **Application Method**: [spray/drench method]
4. **Dosage & Timing**: [specific amounts and frequency]
5. **Environmental Care**: [soil, water, sunlight management]
6. **Prevention**: [future prevention measures]

Make it practical for Indian farmers.`
          }]
        }]
      })
    });

    const result = await response.json();
    
    if (result.candidates?.[0]) {
      return {
        success: true,
        solution: result.candidates[0].content.parts[0].text
      };
    }
    
    throw new Error('No solution available');
  } catch (error) {
    return {
      success: false,
      error: 'Unable to get solution: ' + error.message
    };
  }
};

export const chatWithAI = async (message) => {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are KrishiMitra AI, an expert agricultural assistant for Indian farmers. Provide helpful, practical advice about farming, crops, diseases, weather, and agricultural practices in India. User question: ${message}`
          }]
        }]
      })
    });

    const result = await response.json();
    
    if (result.candidates?.[0]) {
      return {
        success: true,
        response: result.candidates[0].content.parts[0].text
      };
    }
    
    throw new Error('No response from AI');
  } catch (error) {
    return {
      success: false,
      error: 'Chat unavailable: ' + error.message
    };
  }
};