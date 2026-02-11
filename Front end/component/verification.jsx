import { useState } from "react";
import "./signin.css";
export default function Verification() {
    const [formData, setFormData] = useState({
            email: ""
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
            const response = await fetch("http://localhost:4000/verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email     
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
        <>
            <div className="signin-container">
            <h1 className="h1">Verification Message</h1>
            {errMsg && <p style={{color:"red"}}>{errMsg}</p> /* Error Message */ } 
            {success && <p style={{color:"green"}}>{success}</p> /* Success Message */ } 
                <form onSubmit={handleSubmit} className="login-form">

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

                    <button type="submit" className="submit-btn">Send Verification Message</button>
                </form>
            </div>
        </>
    )
}