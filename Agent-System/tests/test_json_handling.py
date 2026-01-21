import sys
from pathlib import Path
root_dir = Path(__file__).resolve().parents[1]
sys.path.append(str(root_dir))
from prompts import build_recipe_prompt, build_thought_prompt
from llm import extract_json
def test_build_recipe_prompt():
    assert build_recipe_prompt(["Egg", "Chicken"])

def test_build_thought_prompt():
    assert build_thought_prompt({"reasoning":"Eggs need to Boiled","action":"Place eggs in a saucepan and cover with cold water. Bring to a boil, then remove from heat, cover, and let sit. Soft-boiled: 3–6 minutes."})

def test_extract_json():
    assert extract_json("{anything: anything}")