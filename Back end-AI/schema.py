from pydantic import BaseModel, Field
from typing import List

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
