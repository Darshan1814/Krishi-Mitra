import json
import time
import requests

def call_gemini_api_with_retries(payload, api_key="", max_retries=5, initial_delay=1):
    """
    Calls the Gemini API with exponential backoff for retries.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}

    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, data=json.dumps(payload))
            response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
            result = response.json()

            if result.get('candidates') and result['candidates'][0].get('content') and \
               result['candidates'][0]['content'].get('parts') and \
               result['candidates'][0]['content']['parts'][0].get('text'):
                # Corrected access from .parts to ['parts']
                return result['candidates'][0]['content']['parts'][0]['text']
            else:
                print(f"Attempt {attempt + 1}: Unexpected API response structure. Retrying...")
                time.sleep(initial_delay * (2 ** attempt))
        except requests.exceptions.HTTPError as e:
            if 429 <= e.response.status_code < 500: # Too Many Requests or other client errors
                print(f"Attempt {attempt + 1}: Client error (HTTP {e.response.status_code}). Retrying...")
                time.sleep(initial_delay * (2 ** attempt))
            elif 500 <= e.response.status_code < 600: # Server errors
                print(f"Attempt {attempt + 1}: Server error (HTTP {e.response.status_code}). Retrying...")
                time.sleep(initial_delay * (2 ** attempt))
            else:
                print(f"An unexpected HTTP error occurred: {e}")
                break # Don't retry for other HTTP errors
        except requests.exceptions.ConnectionError as e:
            print(f"Attempt {attempt + 1}: Connection error: {e}. Retrying...")
            time.sleep(initial_delay * (2 ** attempt))
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break # Don't retry for other errors
    print("Failed to get a valid response from the Gemini API after multiple retries.")
    return "Could not get a crop recommendation at this time. Please try again later."


def get_soil_data():
    """
    Collects soil parameter values from the user.
    """
    print("Please provide the following soil parameters (as measured by your IoT devices):")

    while True:
        try:
            ph = float(input("Soil pH (e.g., 6.5): "))
            if not (0 <= ph <= 14):
                raise ValueError("pH must be between 0 and 14.")
            break
        except ValueError as e:
            print(f"Invalid input: {e}. Please enter a numeric value.")

    while True:
        try:
            moisture = float(input("Soil Moisture Content (%) (e.g., 25.0): "))
            if not (0 <= moisture <= 100):
                raise ValueError("Moisture content must be between 0 and 100.")
            break
        except ValueError as e:
            print(f"Invalid input: {e}. Please enter a numeric value.")

    while True:
        try:
            ec = float(input("Soil Electrical Conductivity (EC) (dS/m) (e.g., 1.2): "))
            if ec < 0:
                raise ValueError("EC cannot be negative.")
            break
        except ValueError as e:
            print(f"Invalid input: {e}. Please enter a numeric value.")

    while True:
        try:
            temp = float(input("Soil Temperature (°C) (e.g., 22.5): "))
            break
        except ValueError as e:
            print(f"Invalid input: {e}. Please enter a numeric value.")

    while True:
        try:
            nitrogen = float(input("Nitrogen (N) (ppm) (e.g., 70): "))
            if nitrogen < 0:
                raise ValueError("Nitrogen cannot be negative.")
            break
        except ValueError as e:
            print(f"Invalid input: {e}. Please enter a numeric value.")

    while True:
        try:
            phosphorus = float(input("Phosphorus (P) (ppm) (e.g., 30): "))
            if phosphorus < 0:
                raise ValueError("Phosphorus cannot be negative.")
            break
        except ValueError as e:
            print(f"Invalid input: {e}. Please enter a numeric value.")

    while True:
        try:
            potassium = float(input("Potassium (K) (ppm) (e.g., 150): "))
            if potassium < 0:
                raise ValueError("Potassium cannot be negative.")
            break
        except ValueError as e:
            print(f"Invalid input: {e}. Please enter a numeric value.")

    return {
        "pH": ph,
        "moisture": moisture,
        "EC": ec,
        "temperature": temp,
        "nitrogen": nitrogen,
        "phosphorus": phosphorus,
        "potassium": potassium
    }


def recommend_crop_with_gemini(soil_data):
    """
    Constructs a prompt with soil data and calls the Gemini API for crop recommendation.
    """
    prompt = f"""
    Based on the following soil parameters, please recommend the best 3 crops to plant.
    Consider general agricultural knowledge about crop requirements for these conditions.

    Soil pH: {soil_data['pH']}
    Soil Moisture: {soil_data['moisture']}%
    Soil EC: {soil_data['EC']} dS/m
    Soil Temperature: {soil_data['temperature']} °C
    Nitrogen (N): {soil_data['nitrogen']} ppm
    Phosphorus (P): {soil_data['phosphorus']} ppm
    Potassium (K): {soil_data['potassium']} ppm

    Please list 3 suitable crops and briefly explain why each is a good fit based on the provided data.
    If the conditions are severely limiting for most common crops, please mention that.
    Format your response as a numbered list.
    """

    chat_history = []
    chat_history.append({"role": "user", "parts": [{"text": prompt}]})
    payload = {"contents": chat_history}

    # The API key is automatically provided by the Canvas environment if left as an empty string.
    api_key = "AIzaSyDrYXOmHqiChayrg_yC0i-aGi-OqeJw1v4"
    print("\nAnalyzing soil data with Gemini AI...")
    response_text = call_gemini_api_with_retries(payload, api_key)
    return response_text


def main():
    print("Welcome to the IoT Soil Crop Recommender Chatbot!")
    print("I will help you determine the best crops to plant based on your soil's IoT data.")

    soil_data = get_soil_data()
    recommendation = recommend_crop_with_gemini(soil_data)

    print("\n--- Crop Recommendation ---")
    print(recommendation)
    print("\n--------------------------")
    input("Press Enter to exit...") # Added temporary hold
    print("Thank you for using the Soil Crop Recommender Chatbot!")

if __name__ == "__main__":
    main()
