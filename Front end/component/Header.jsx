export default function Header(prop){
    return (
        <header className="header">
            <div></div>
            <div className="header_logo">
                <img src={prop.src} alt={prop.alt}  className={prop.classname} />
                <h1 className="title_h1">{prop.name}</h1>        
            </div>
            <div className="header_links">
                <a className="linktag_header"><p>Log in</p></a> 
                <a className="linktag_header"><p>Sign in</p></a>
            </div>
        </header>
    )
}

// dietaryRestrictions