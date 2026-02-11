import "./login.css";
import {useState} from "react";
import { useContext } from "react";
import AuthContext from "../src/context/authContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "" // Changed 'pwd' to 'password' to match the input name
    });

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setErrMsg("");
    }

    
    async function handleSubmit(event) {
        event.preventDefault();
        try{
            const response = await fetch("http://localhost:4000/auth", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: "include",
                body: JSON.stringify({
                    user: formData.username,
                    pwd: formData.password
                }),
            });
            if(response.ok){
                const data = await response.json();
                
                setAuth({accessToken: data.accessToken});
                console.log("finally log in");
                navigate("/");
            }
            else if(response.status == 401)
            {
                setErrMsg("User and Password Doesn't exist.");
            }
            else if(response.status == 400)
            {
                setErrMsg("User and Password are Required.");
            }
            else if(response.status == 429){
                const data = await response.json();
                setErrMsg(`${data.message}`)
            }
            else {
                setErrMsg("Something Wrong please try again.");
            }
        }catch(err){
            console.log(err);
            setErrMsg("No Server Response. Check your connection.");
        }

    }

    return (
        <div className="signin-container">
            <h1 className="h1">Log In</h1>
            {errMsg && <p style={{color:"red"}}>{errMsg}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="username">Username</label>
                <input 
                    
                    className="input_form"
                    type="text" 
                    id="username"
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                />

                <label htmlFor="password">Password</label>
                <input 
                    className="input_form"
                    type="password" 
                    id="password"
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />

                <button type="submit" className="submit-btn">Log In</button>
                <Link to="/ResetPassword" className="reset_password_link"><p className="reset_password">did you forgot your password?</p></Link>
            </form>
            <div className="emailVerification_message">
                <p>Didn't recieve email verification message yet?<Link to="/Verification" className="verification_link"> Click here</Link></p>
            </div>
        </div>
    );
}
