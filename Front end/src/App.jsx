import Header from "/component/Header.jsx";
import { Fragment, useState, useEffect} from "react";
import chefClaudeLogo from "/chef_claude_.png";
import Main from "/component/Main.jsx";
import Login from "/component/Login.jsx";
import Signin from "/component/Signin.jsx";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/authContext";
import useRefreshToken from "./hooks/useRefreshToken";
import Verification from "/component/verification.jsx";

export default function App() {
    const [ingredient, setIngredient] = useState([]);
    const [response, setResponse] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [notlimits, setNotLimits] = useState(false);

    const { auth, setAuth } = useContext(AuthContext);
    const refresh = useRefreshToken();

    useEffect(() => {
        const verify = async () => {
            try {
                await refresh(); 
            } catch (err) {
                console.error("User not logged in");
            }
        };
        verify();
    }, []);

    const sendPrompt = async (payload) => {
        try {
            let currentToken = auth?.accessToken;

            let res = await fetch("http://localhost:4000/generate", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // If Expired, try to refresh once
            if (res.status === 403) {
                const newToken = await refresh(); // Get fresh token
                if (newToken) {
                    // Retry the call immediately with the NEW token
                    res = await fetch("http://localhost:4000/generate", {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${newToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                }
            }

            
            if (res.ok) {
                const data = await res.json();
                setResponse(data);
                setNotLimits(true);
            } else if (res.status === 429) {
                const data = await res.json();
                setResponse(data);
                setNotLimits(false);
            }
        } catch (error) {
            console.error("Network error:", error);
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
                    <Route path="/Verification" element={<Verification></Verification>}></Route>
                </Routes>
            </Fragment>
        
    )
}