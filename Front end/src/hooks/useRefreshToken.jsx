import { useContext } from "react";
import AuthContext from "../context/authContext";

const useRefreshToken = () => {
    const { setAuth } = useContext(AuthContext);

    const refresh = async () => {
         try {
            const response = await fetch("http://localhost:4000/refresh", {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                setAuth({ accessToken: null });
                return null;
            }

            const data = await response.json();
            setAuth({ accessToken: data.accessToken });
            return data.accessToken;

        } catch (err) {
            setAuth({ accessToken: null });
            return null;
        } finally {
            setLoading(false);
        }
        
    };
    return refresh;
};

export default useRefreshToken;