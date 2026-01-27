import { useContext } from "react";
import AuthContext from "../context/authContext";

const useRefreshToken = () => {
    const { setAuth } = useContext(AuthContext);

    const refresh = async () => {
        const response = fetch("http://localhost:4000/refresh", {
            method:"GET",
            credentials:"include"
        });

        if(!response) throw new Error("Refresh Error");
        if(response.ok){
            const data = await response.json();
            setAuth({accessToken: data.accessToken});

            return data.accessToken;
        }
        else if(response.status == 401){
            return response.status;
        }
        else if(response.status == 403){
            return response.status;
        }
        
    };
    return refresh;
};

export default useRefreshToken;