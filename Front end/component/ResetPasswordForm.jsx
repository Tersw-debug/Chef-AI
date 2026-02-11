import { useState } from "react";
import { useParams } from "react-router-dom";
import "./signin.css";

export default function ResestPasswordForm(){
    const { token } = useParams();
    console.log(token);
    const [formData, setFormData] = useState({
                password: ""
            });
        const [counter, setCounter] = useState(0);
        const [errMsg, setErrMsg] = useState("");
        
        const [success, setSuccess] = useState("");
    
        
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
            try {
                const response = await fetch("http://localhost:4000/password/reset-password/confirm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token,
                        password: formData.password     
                    }),
                });
                const nextCount = counter + 1;
                setCounter(nextCount);
                if(response.ok){
                    
                    const data = await response.json();
                    setSuccess(success => `${data.message} ${nextCount}`);
                }
                else if(response.status === 409){
                    let counter = 0;
                    setErrMsg(errMsg => `Email is already verified. ${nextCount}`);
                    setSuccess("");
                }
                }catch(err){
                    console.log(err);
                }
        }
       return(
        <div className="signin-container">
            <h1 className="h1">Reset Password</h1>
            
            {/* 3. Using the 'key' trick we discussed so the animation restarts! */}
            {errMsg && (
                <p key={`err-${counter}`} className="error_message" style={{color:"red"}}>
                    {errMsg}
                </p>
            )} 
            
            {success && (
                <p key={`success-${counter}`} className="response_message" style={{color:"green"}}>
                    {success}
                </p>
            )} 

            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="password">New Password</label>
                <input 
                    className="input_form"
                    type="password" 
                    id="password"
                    name="password" // Matches state key
                    value={formData.password} // Matches state key
                    onChange={handleChange} 
                    required 
                />
                <button type="submit" className="submit-btn">Reset Password</button>
            </form>
        </div>
    )
}