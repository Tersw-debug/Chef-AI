import Header from "/component/Header.jsx";
import { Fragment, useState, useEffect} from "react";
import chefClaudeLogo from "/chef_claude_.png";
import Main from "/component/Main.jsx";
import Login from "/component/Login.jsx";
import Signin from "/component/Signin.jsx";
import { Routes, Route } from "react-router-dom";
export default function App() {
    const [ingredient, setIngredient] = useState([]);
    const [response, setResponse] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [notlimits, setNotLimits] = useState(false);
    const sendPrompt = async (payload) => {
        try {
            const res = await fetch("http://localhost:4000/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if(res.ok)
            {
                const data = await res.json();
                console.log("sendPrompt called");
                console.log(data);
                setResponse(data);
                setNotLimits(true);
            }
            else if(res.status == 429){
                const data = await res.json();
                console.log(data);
                setResponse(data);
                setNotLimits(false);
            }
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    };


    return (
        
            <Fragment>
                <Header src={chefClaudeLogo} alt='Chef Claude Logo' classname="logo" name='Chef AI' />
                <Routes>
                    <Route path="/" element={
                        <Main ingredient={ingredient} setIngredient={setIngredient}
                        response={response} setResponse={setResponse}
                        prompt={prompt} setPrompt={setPrompt}
                        sendPrompt={sendPrompt}
                        notlimits={notlimits} setNotLimits={setNotLimits}
                        />}
                    ></Route>
                    <Route path="/Login" element={<Login></Login>}></Route>
                    <Route path="/Signin" element={<Signin></Signin>}></Route>
                </Routes>
            </Fragment>
        
    )
}