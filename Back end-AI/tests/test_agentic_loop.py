import sys
from pathlib import Path
root_dir = Path(__file__).resolve().parents[1]
sys.path.append(str(root_dir))

from unittest.mock import patch
from schema import RecipeRequest, RecipeResponse
import json
from agent import run_agent

MOCK_THOUGHT = {
    "reasoning":"I should generate a recipe",
    "action":"generate_recipe"
}

MOCK_RECIPE = {
    "title":"Chicken Rice",
    "ingredients": ["chicken", "rice"],
    "steps": ["Cook rice", "Cook chicken"]
}

def test_agent_loop_success():
    responses = [
        json.dumps(MOCK_THOUGHT),
        json.dumps(MOCK_RECIPE)
    ]

    def fake_completion(*args, **kwargs):
        class Fake:
            choices = [
                type("x", (), {
                    "message":type("y",(), {
                        "content":responses.pop(0)
                    })()
                })
            ]
        return Fake()
    with patch("llm.client.chat.completions.create", fake_completion):
        req = RecipeRequest(ingredients=["chicken", "rice"])
        result = run_agent(req)
        assert isinstance(result, RecipeResponse)
        assert result.title == "Chicken Rice"