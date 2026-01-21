import { Link } from 'react-router-dom';
import { Fragment } from 'react';
export default function Header(prop){
    return (
        <header className="header">
            <div></div>
            <div className="header_logo">
                <img src={prop.src} alt={prop.alt}  className={prop.classname} />
                <Link to="/" className='main_page_header'><h1 className="title_h1">{prop.name}</h1></Link>        
            </div>
            <div className="header_links">
                <Fragment>
                    <Link to="/Login" className="linktag_header" >Log in</Link>
                    <Link to="/Signin" className="linktag_header" >Sign in</Link>
                </Fragment>
            </div>
        </header>
    )
}

// dietaryRestrictions