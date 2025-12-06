import React, { Fragment, useState, useEffect } from "react";

export default function Main(prop){
    function handleIngredientChange(formData) {
        const ingredientInput = formData.get("ingredient_input");
        if (ingredientInput === "") return;
        prop.setIngredient(prevIngredient => ([...prevIngredient, 
            {"id": Date.now(),"name":ingredientInput}]));
    }
    return (
        <main className="main">
            <form  action={handleIngredientChange} className="form__main">
                <input
                type="text"
                name="ingredient_input"
                id="input__form" 
                placeholder="e.g. oregano"
                className="input__form" 
                aria-label="Add ingredient" />
                <button className="button__form">Add ingredient</button>
            </form>
            {prop.ingredient.length > 0 ?  <IngredientList
                                                        setIngredient={prop.setIngredient} 
                                                        ingredient={prop.ingredient}
                                                        prompt={prop.prompt} 
                                                        setPrompt={prop.setPrompt}
                                                        response={prop.response}
                                                        setResponse={prop.setResponse} 
                                                        sendPrompt={prop.sendPrompt}
                                                        /> : null}
        </main>
    )
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
                <button className="deleteBtn" onClick={() => deleteTask(item.id)}>Delete</button>
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
        let message = `Create a recipe using ${prop.ingredient.map((i) => i.name).join(", ")}`;
        prop.setPrompt(message);
        setLoading(true);
        await prop.sendPrompt(message);        
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
                            <button className={`${loading? "loading_btn" : "api_submit"} `} onClick={calling} disabled={loading}>{buttonText}</button>
                        </div>: null}
                        <div className="spacer"></div>
            </section>
            <div className="spacer_section"></div>
            <section>
                    {prop.response !== "" ? (
                        <div className="response_message">
                            <h2 className="recipe__title">Generated Recipe:</h2>
                            <p className="recipe__description">{prop.response}</p>
                        </div>
                    ) : null}
            </section>
        </Fragment>
    )
}