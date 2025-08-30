import React, { Fragment } from "react";

export default function Main(prop){
    function handleIngredientChange(formData) {
        const ingredientInput = formData.get("ingredient_input");
        if (ingredientInput === "") return;
        prop.setIngredient(prevIngredient => ([...prevIngredient, ingredientInput]));
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
            {prop.ingredient.length > 0 ?  <IngredientList ingredient={prop.ingredient}
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
    
    const ingredientlist = prop.ingredient.map((item, key) => {
        return (
            <li key={key} className="ingredient__li">{item}</li>
        )

    })

    function calling() {
        let messege = `Create a recipe using ${prop.ingredient.join(", ")}`;
        prop.setPrompt(messege);
        prop.sendPrompt(messege);
        
    }
    console.log(prop.prompt)
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
                            <button className="api_sumbit" onClick={calling}>Get a recipe</button>
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