import Header from "/component/Header.jsx";
import { Fragment, useState, useEffect} from "react";
import chefClaudeLogo from "/chef_claude_.png";
import Main from "/component/Main.jsx";
export default function App() {
    const [ingredient, setIngredient] = useState([]);
    const [response, setResponse] = useState("");
    const [prompt, setPrompt] = useState("");
    
    const sendPrompt = async (prompt_message) => {
        if (prompt_message !== prompt) {
            console.log("Same prompt, not sending request.");   
        }
        try {
            const res = await fetch('http://localhost:8000/generate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: prompt_message
                }),
            });
            const data = await res.json();
            setResponse(data.response);
        }
        catch (error) {
            console.error("Error fetching recipe:", error);
        }
    }


    return (
        <Fragment>
            <Header src={chefClaudeLogo} alt='Chef Claude Logo' classname="logo" name='Chef AI' />
            <Main ingredient={ingredient} setIngredient={setIngredient}
                  response={response} setResponse={setResponse}
                  prompt={prompt} setPrompt={setPrompt}
                  sendPrompt={sendPrompt}
                  />
        </Fragment>
    )
}