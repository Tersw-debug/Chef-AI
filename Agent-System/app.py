from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from schema import Thought, RecipeRequest, RecipeResponse

from agent import run_agent
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




@app.post("/generate", response_model=RecipeResponse)
async def generate_text(input: RecipeRequest):
    # First Step (Memory)
    return run_agent(input)