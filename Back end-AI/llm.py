from dotenv import load_dotenv
load_dotenv()
from huggingface_hub import InferenceClient
import os
import json
from schema import RecipeResponse
HF_API_KEY = os.getenv("READ__TOKEN__ACCESS")
client = InferenceClient(
    provider="hf-inference",
    api_key=HF_API_KEY,
)


def extract_json(text: str) -> str:
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON found")
    return text[start:end+1]


def call_llm(messages, max_retries=3):
    last_error = None

    for attempt in range(max_retries):
        completion = client.chat.completions.create(
            model="HuggingFaceTB/SmolLM3-3B",
            messages=messages,
        )

        result = completion.choices[0].message.content

        try:
            json_text = extract_json(result)
            parsed = json.loads(json_text)
            recipe = RecipeResponse(**parsed)
            return recipe 
        except Exception as e:
            last_error = str(e)
            messages.append({
                "role": "system",
                "content": f"""
Your previous output was invalid JSON.
Error: {last_error}

Fix the output.
Return ONLY valid JSON.
"""
            })

    raise ValueError("Model failed after retries")
