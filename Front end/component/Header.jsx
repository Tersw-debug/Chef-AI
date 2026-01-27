import { Link } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import AuthContext from "../src/context/authContext";
import { useNavigate } from 'react-router-dom';

export default function Header(prop){
    const {auth, setAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    const currentToken = auth?.accessToken;
    const handleLogout = async () =>{
        try{
            let response = await fetch("http://localhost:4000/logout", {
                method:"POST",
                headers:{
                    'Authorization': `Bearer ${currentToken}`,
                    "Content-Type": "application/json",
                },
                credentials:"include"
            });
            if(response.status == 204){
                setAuth({});
                navigate("/");
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <header className="header">
            <div></div>
            <div className="header_logo">
                <img src={prop.src} alt={prop.alt}  className={prop.classname} />
                <Link to="/" className='main_page_header'><h1 className="title_h1">{prop.name}</h1></Link>        
            </div>
            <div className="header_links">
                { !auth?.accessToken ? (
                    <Fragment>
                        <Link to="/Login" className="linktag_header">Log in</Link>
                        <Link to="/Signin" className="linktag_header">Sign in</Link>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Link to="/Profile" className="linktag_header">Profile</Link>
                        <button className='linktag_header' onClick={handleLogout}>Log Out</button>
                    </Fragment>
                )}
            </div>
        </header>
    )
}

// dietaryRestrictions