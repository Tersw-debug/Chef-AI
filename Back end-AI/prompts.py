from schema import RecipeRequest
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
