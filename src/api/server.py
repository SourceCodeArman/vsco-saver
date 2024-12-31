from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

def fetch_profile_image_id(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
        
        profile_image_id = None
        
        # Search for profileImageId in the response text
        start_index = response.text.find('"profileImageId":"')
        if start_index != -1:
            start_index += len('"profileImageId":"')
            end_index = response.text.find('"', start_index)
            profile_image_id = response.text[start_index:end_index]
        
        return profile_image_id
        
    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)
        return None

@app.route('/api/fetch-profile-image', methods=['POST'])
def fetch_profile_image():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    profile_image_id = fetch_profile_image_id(url)
    
    if profile_image_id:
        return jsonify({"profile_image_url": f"im.vsco.co/{profile_image_id}"})
    else:
        return jsonify({"error": "Profile Image URL not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
