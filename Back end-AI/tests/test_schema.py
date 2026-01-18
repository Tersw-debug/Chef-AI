from schema import RecipeRequest, RecipeResponse

def test_vaild_RecipeRequest():
    recipe = RecipeRequest(
           ingredients=["Egg", "Salad"]
    )
    assert recipe.ingredients[0] == "Egg"

def test_vaild_RecipeResponse():
    response = RecipeResponse(
        title="Egg and Salad",
        ingredients=["Egg", "Salad"],
        steps=["Fill a pot with water", "Put the pot on stove and make control knob on middle", "Put eggs in the pot"],
        cooking_time=15
    )
    assert response.ingredients[0] == "Egg"
