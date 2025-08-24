import { createContext, useContext, useEffect, useState } from "react";
import { APIconnection } from "../assets/Helpers";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const initialUserData = {
    id: null,
    name: null
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(initialUserData);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await APIconnection('auth');
                setUserData(response);
            } catch (e) {
                setUserData(initialUserData);
                navigate('/auth');
            } finally {
                setIsLoading(false);
            }
        }

        validateToken()
    }, []);

    return (
        <AuthContext.Provider value={{userData, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);