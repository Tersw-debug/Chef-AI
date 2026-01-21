import "./login.css";
import {useState} from "react";
export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "" // Changed 'pwd' to 'password' to match the input name
    });

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    // Rename to 'handleChange' to match the JSX below
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setErrMsg("");
    }

    // Rename to 'handleSubmit' to match the JSX below
    async function handleSubmit(event) {
        event.preventDefault();
        try{
            const response = await fetch("http://localhost:4000/auth", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                    user: formData.username,
                    pwd: formData.password
                }),
            });
            if(response.ok){
                const data = await response.json();
                localStorage.setItem("token", data.accessToken);
                
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
            </form>
        </div>
    );
}
