from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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
class InputPrompt(BaseModel):
    text: str
@app.post("/generate")
async def generate_text(input: InputPrompt):
    completion = client.chat.completions.create(
        model="HuggingFaceTB/SmolLM3-3B",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Only reply with the final answer, never include your thinking process or <think> tags."
            },
            {
                "role": "user",
                "content": input.text
            }
        ],
    )
    result = completion.choices[0].message.content

    cleaned = re.sub(r"<think>.*?</think>", "", result, flags=re.DOTALL).strip()
    return {
        "response": cleaned
    }
    