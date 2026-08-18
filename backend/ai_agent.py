from google import genai
import os
import sys
import json

os.environ["GEMINI_API_KEY"] = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")

def main():
    try:
        client = genai.Client()
        input_text = sys.argv[1] if len(sys.argv) > 1 else ""
        
        prompt = f"""You are a helpful assistant for a civic grievance platform. 
The user has provided the following raw complaint, which might be in a regional language or poorly formatted English.
Your task is to translate it to English (if necessary) and rewrite it into a clear, concise, and professional civic complaint.
Keep it brief and directly state the issue and location if provided. Do not include any conversational filler or greetings.
Raw text: "{input_text}" """

        interaction = client.interactions.create(
            model="gemini-3.7-flash",
            input=prompt
        )
        print(json.dumps({"success": True, "text": interaction.output_text}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()
