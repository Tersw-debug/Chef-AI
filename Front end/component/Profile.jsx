import "./profile.css";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../src/context/authContext";


export default function Profile() {
    const [edit, setEdit] = useState(false);
    const {auth} = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "dsadsacsasca"
    });
    useEffect(() => {
        const getData = async () => {
            try {
            const currentToken = auth?.accessToken;
            if (!currentToken) return;

            const response = await fetch(
                "http://localhost:4000/profile/getUser",
                {
                    method:"GET",
                    headers: {
                        Authorization: `Bearer ${currentToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setFormData({
                username: data.username,
                email: data.email,
                phone: data.phone,
                password: "" // never preload password
                });
            }
            } catch (err) {
            console.error(err);
            }
        };

        getData();
        }, [auth]);
    const updateData = async () => {
        try {
            const currentToken = auth?.accessToken;
            if (!currentToken) return;

            const response = await fetch(
                "http://localhost:4000/profile/update",
                {
                    method:"PUT",
                    headers: {
                        Authorization: `Bearer ${currentToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        phone: formData.phone
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                
                setErrMsg(`${data.message}`);
            }
            } catch (err) {
            console.error(err);
            }
        };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = () => {
        setEdit(true);
    };

    const handleSave = () => {
        updateData();
        setEdit(false);
    };
    const password = "*".repeat(formData.password.length);
    return (
        <div className="profile_container">
            {errMsg && <p style={{color:"red"}}>{errMsg}</p>}
            <div className="container-header">
                <span></span>
                <h2 className="h2_profile">Profile</h2>
                {!edit ? (
                    <button
                        type="button"  
                        className="edit_button"
                        onClick={handleEdit}>
                        Edit
                    </button>
                ) : (
                    <button
                        type="button" 
                        className="edit_button"
                        onClick={handleSave}>
                        Save
                    </button>
                )}
            </div>

            <ul className="data_container">
                <li className="data_li">
                    <span className="li_frame">Username</span>
                    {edit ? (
                        <input
                            className="input_form"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    ) : (
                        <p className="data">{formData.username}</p>
                    )}
                </li>

                <li className="data_li">
                    <span className="li_frame">Email</span>
                    {edit ? (
                        <input
                            className="input_form"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    ) : (
                        <p className="data">{formData.email}</p>
                    )}
                </li>

                <li className="data_li">
                    <span className="li_frame">Phone</span>
                    {edit ? (
                        <input
                            className="input_form"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    ) : (
                        <p className="data">{formData.phone}</p>
                    )}
                </li>
                <li className="data_li">
                    <span className="li_frame">Password</span>
                    {edit ? (
                        <input
                            className="input_form"
                            type="text"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    ) : (
                        <p className="data">{password}</p>
                    )}
                </li>
            </ul>
        </div>
    );
}