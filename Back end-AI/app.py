from fastapi import FastAPI, HTTPException, Request
import json
from fastapi.middleware.cors import CORSMiddleware
from schema import Thought, RecipeRequest, RecipeResponse
from prompts import build_recipe_prompt, build_thought_prompt
from llm import call_llm, extract_json, client
from tools import TOOLS
from typing import List
from logging_config import logger
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

# actually completion.choices[0].message gives you the message object not the content
# so you need to access content from 



max_retreies_general = 5

@app.post("/generate", response_model=RecipeResponse)
async def generate_text(input: RecipeRequest):
    # First Step (Memory)
    logger.info(f"Generative Request Received. Ingredients: {input.ingredients}")
    memory: List[dict] = [
        {
            "role": "system",
            "content": "You are a ReAct-style chef agent. Think, then act using tools."
        },
        {
            "role": "user", 
            "content": build_thought_prompt(input)
        }
    ]
    
    for _ in range(max_retreies_general):
        logger.info(f"Agent Step {_ + 1}/{max_retreies_general} started.")
        try:
            completion = client.chat.completions.create(
                model="HuggingFaceTB/SmolLM3-3B",
                messages=memory,
            )
            output = completion.choices[0].message.content

            logger.debug(f"Raw LLM Output: {output}")
            try:
                json_text = extract_json(output)
                parsed = json.loads(json_text)
                final_thought = Thought(**parsed)
            except Exception as e:
                logger.warning(f"JSON Parse Error on step {_ + 1}: {e}. Retrying with error prompt.")
                memory.append({
                    "role": "system",
                    "content": f"Your previous output was invalid JSON: {str(e)}. Return ONLY valid JSON matching Thought schema."
                })
                continue 

        except Exception as e:
            logger.error(f"LLM API Call Failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Thought parsing faild: {str(e)}")

        if final_thought.action not in TOOLS:
            logger.error(f"Invalid Action attempted: {final_thought.action}")
            raise HTTPException(status_code=500, detail=f"Unknown action : {final_thought.action}")
        
        try:
            logger.debug(f"Executing tool: {final_thought.action}")
            result = TOOLS[final_thought.action](input)
        except Exception as e:
            logger.error(f"Tool {final_thought.action} failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Tools Execution faild: {str(e)}")

        memory.append({
            "role":"system",
            "content": f"Observation from last action: {result.model_dump_json()}"
        })

        if isinstance(result, RecipeResponse):
            logger.info("Recipe successfully generated and returned.")
            return result
    logger.error("Agent exhausted max steps without producing a final recipe.")
    raise HTTPException(status_code=500, detail=f"Agent Faild to produce a recipe in max steps")