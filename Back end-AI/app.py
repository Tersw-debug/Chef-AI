from fastapi import FastAPI, HTTPException
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import re
from dotenv import load_dotenv
load_dotenv()
from huggingface_hub import InferenceClient
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_API_KEY = os.getenv("READ__TOKEN__ACCESS")
client = InferenceClient(
    provider="hf-inference",
    api_key=HF_API_KEY,
)

# actually completion.choices[0].message gives you the message object not the content
# so you need to access content from it
class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(...,
                                min_items=1,
                                description="List of available ingredients"
                            )


def build_prompt(data: RecipeRequest) -> str:
    ingredients = ", ".join(data.ingredients)

    return f"""
    You are a professional chef AI.

    Create a recipe using ONLY these ingredients:
    {ingredients}

    
    
Return EXACTLY one JSON object.
No backticks.
No extra text.
No markdown.

The JSON MUST match this schema exactly:

{{
  "title": "string",
  "ingredients": ["string"],
  "steps": ["string"],
  "cooking_time": number
}}
    """

class RecipeResponse(BaseModel):
    title: str
    ingredients: List[str]
    steps: List[str]
    cooking_time: int


def extract_json(text: str) -> str:
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON found")
    return text[start:end+1]

@app.post("/generate", response_model=RecipeResponse)
async def generate_text(input: RecipeRequest):
    prompt = build_prompt(input)
    completion = client.chat.completions.create(
        model="HuggingFaceTB/SmolLM3-3B",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Only reply with the final answer, never include your thinking process or <think> tags."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )
    result = completion.choices[0].message.content
    try:
        json_text = extract_json(result)
        parsed = json.loads(json_text)
        recipe = RecipeResponse(**parsed)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="AI output is not valid"                    
        )
    
    return recipe
    
    