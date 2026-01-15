import React, { Fragment, useState, useEffect } from "react";
export default function Main(prop) {

    function handleIngredientChange(e) {
        e.preventDefault(); // 🚨 THIS FIXES EVERYTHING

        const formData = new FormData(e.target);
        const ingredientInput = formData.get("ingredient_input");

        if (!ingredientInput) return;

        prop.setIngredient(prev => [
            ...prev,
            { id: Date.now(), name: ingredientInput }
        ]);

        e.target.reset(); // optional UX improvement
    }

    return (
        <main className="main">
            <form onSubmit={handleIngredientChange} className="form__main">
                <input
                    type="text"
                    name="ingredient_input"
                    placeholder="e.g. oregano"
                    className="input__form"
                />
                <button type="submit" className="button__form">
                    Add ingredient
                </button>
            </form>

            {prop.ingredient.length > 0 && (
                <IngredientList {...prop} />
            )}
        </main>
    );
}


function IngredientList(prop) {
    const initialize = "Get a recipe";
    const [buttonText, setButtonText] = useState(initialize);
    const [loading, setLoading] = useState(false);

    const deleteTask = (taskToDelete) => {
        let newIngrident = prop.ingredient.filter(task => task.id !== taskToDelete);
        prop.setIngredient(newIngrident);
    };

    const ingredientlist = prop.ingredient.map((item, key) => {
        return (
            <li key={key} className="ingredient__li">{item.name}
                <button
                    type="button"   // 🚨 REQUIRED
                    className="deleteBtn"
                    onClick={() => deleteTask(item.id)}
                >
                    Delete
                </button>
            </li>
        )

    })

    useEffect(() => {
        if(!loading)
        {
            setButtonText("Get a recipe");
            return;
        }
        let steps = ["Loading.", "Loading..", "Loading..."];
        let index = 0;
        const interval = setInterval(()=>{
                setButtonText(steps[index]);
                index = (index + 1) % steps.length;
            }
        ,400);
        return () => clearInterval(interval)
    }, [loading]);
    async function calling() {
        const ingredients = prop.ingredient.map(i => i.name);

        prop.setPrompt(ingredients.join(", ")); // UI display only
        setLoading(true);

        await prop.sendPrompt({
            ingredients: ingredients
        });

        setLoading(false);
    }

    return (
        <Fragment>
            <section className="ingredient__section">
                        <h2 className="ingredient__title">Ingredients on hand:</h2>
                        <ul className="ingredient__list">{ingredientlist}</ul>
                        {prop.ingredient.length > 3 ?<div className="recipe__message">
                            <div className="asking__message">
                                <p className="asking__message_p">Ready for a recipe? </p>
                                <p className="telling_message">Generate recipe from your list of ingredients.</p>
                            </div>
                            <button
                                type="button"   // 🚨 VERY IMPORTANT
                                className={loading ? "loading_btn" : "api_submit"}
                                onClick={calling}
                                disabled={loading}
                            >
                                {buttonText}
                            </button>
                        </div>: null}
                        <div className="spacer"></div>
            </section>
            <div className="spacer_section"></div>
            <section>
                    {prop.response && (
                        <div className="response_message">
                            <h2 className="recipe__title">{prop.response.title}</h2>

                            <h3 className='ingredients_h3'>Ingredients</h3>
                            <ul className="ingredients_list">
                                {prop.response.ingredients.map((i, idx) => (
                                    <li key={idx}>{i}</li>
                                ))}
                            </ul>

                            <h3 className="Steps_h3">Steps</h3>
                            <ol className="Steps_list">
                                {prop.response.steps.map((s, idx) => (
                                    <li key={idx}>{s}</li>
                                ))}
                            </ol>

                            <p className="cooking_time"><strong>Cooking time:</strong> {prop.response.cooking_time} minutes</p>
                        </div>
                    )}
            </section>
        </Fragment>
    )
}