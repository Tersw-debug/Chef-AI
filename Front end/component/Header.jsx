import { Link } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import AuthContext from "../src/context/authContext";

export default function Header(prop){
    const {auth} = useContext(AuthContext);
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
                    
                    <button onClick={() => {}}>Log Out</button>
                )}
            </div>
        </header>
    )
}

// dietaryRestrictions