from schema import RecipeRequest, RecipeResponse
from prompts import build_recipe_prompt
from llm import call_llm
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