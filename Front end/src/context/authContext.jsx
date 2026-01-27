import { createContext, useState } from "react";

// This is the object you'll use with the useContext hook
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => { // Fixed spelling: children
    const [auth, setAuth] = useState({
        accessToken: null
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children} {/* Fixed spelling: children */}
        </AuthContext.Provider>
    );
};

export default AuthContext;