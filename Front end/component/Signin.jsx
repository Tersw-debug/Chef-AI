import { useState } from "react";
import "./signin.css";

export default function Signin() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
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
        try {
            const response = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // MATCHING DATA: Mapping 'password' to 'pwd' for the backend
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    pwd: formData.password 
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                // Success!
                setSuccess(true);
                setErrMsg("");
                console.log(data.message);
            } else if (response.status === 409) {
                setErrMsg("Username or Email already taken.");
            } else if (response.status === 400) {
                setErrMsg("Please fill in all fields correctly.");
            } else {
                setErrMsg("Registration failed. Please try again.");
            }

        } catch (err) {
            console.log(err);
            setErrMsg("No Server Response. Check your connection.");
        }

    }

    return (
        <div className="signin-container">
            <h1 className="h1">Create Account</h1>
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

                <label htmlFor="email">Email</label>
                <input 
                    className="input_form"
                    type="email" 
                    id="email"
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />

                <label htmlFor="phone">Phone Number</label>
                <input 
                    className="input_form"
                    type="tel" 
                    id="phone"
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
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

                <button type="submit" className="submit-btn">Sign In</button>
            </form>
        </div>
    );
}