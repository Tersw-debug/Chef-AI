from fastapi import FastAPI, HTTPException, Request
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

""" 
@app.post("/generate")
async def generate_text(request: Request):
    body = await request.json()
    print("RAW BODY:", body)
 """


# actually completion.choices[0].message gives you the message object not the content
# so you need to access content from it
class Thought(BaseModel):
    reasoning: str
    action: str

class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(...,
                                min_items=1,
                                description="List of available ingredients"
                            )



class RecipeResponse(BaseModel):
    title: str
    ingredients: List[str]
    steps: List[str]
    cooking_time: int


def build_thought_prompt(data: RecipeRequest) -> str:
    ingredients = ", ".join(data.ingredients)
    return f"""
    You are a professional chef AI.

    Ingredients available: {ingredients}

    Before producing the final recipe:
    - Explain your reasoning briefly.
    - Then state your action.

    Return JSON:
    {{
    "reasoning": "...",
    "action": "generate_recipe"
    }}
    """




def build_recipe_prompt(data: RecipeRequest) -> str:
    ingredients = ", ".join(data.ingredients)

    return f"""

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

def generate_recipe(data: RecipeRequest) -> RecipeResponse:
    
    prompt = build_recipe_prompt(data)
    messages = [
        {
            "role": "system",
            "content":"You are a helpful chef AI. Only output the recipe JSON"
        },
        {
            "role":"user",
            "content":prompt
        }
    ]
    return call_llm(messages)




TOOLS = {
    "generate_recipe": generate_recipe
}
max_retreies_general = 5

@app.post("/generate", response_model=RecipeResponse)
async def generate_text(input: RecipeRequest):
    # First Step (Memory)
    
    memory: List[dict] = [
        {
            "role": "system",
            "content": "You are a ReAct-style chef agent. Think, then act using tools."
        }
    ]
    
    for _ in range(max_retreies_general):
        thought = build_thought_prompt(input)
        memory.append({"role":"user", "content": thought})
        try:
            completion = client.chat.completions.create(
                model="HuggingFaceTB/SmolLM3-3B",
                messages=memory,
            )
            output = completion.choices[0].message.content
            try:
                json_text = extract_json(output)
                parsed = json.loads(json_text)
                final_thought = Thought(**parsed)
            except Exception as e:
                memory.append({
                    "role": "system",
                    "content": f"Your previous output was invalid JSON: {str(e)}. Return ONLY valid JSON matching Thought schema."
                })
                continue 

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Thought parsing faild: {str(e)}")

        if final_thought.action not in TOOLS:
            raise HTTPException(status_code=500, detail=f"Unknown action : {final_thought.action}")
        
        try:
            result = TOOLS[final_thought.action](input)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Tools Execution faild: {str(e)}")

        memory.append({
            "role":"system",
            "content": f"Observation from last action: {result.model_dump_json()}"
        })

        if isinstance(result, RecipeResponse):
            return result
    raise HTTPException(status_code=500, detail=f"Agent Faild to produce a recipe in max steps")