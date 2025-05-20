import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
interface User{
    id:string;
    email:string;
    firstName:string;
    lastName:string;
    phoneNumber?: string;
}

interface AuthContextType{
    user:User | null;
    token:string | null;
    login:(email:string, password:string) => Promise<void>;
    signup:(inputs:{
        firstName:string;
        lastName:string;
        email:string;
        password:string;
        phoneNumber?: string;
    }) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    updateUserPhoneNumber: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({children}:{children:ReactNode}) =>{
    const [user,setUser]=useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const initializedRef = useRef(false);

    useEffect(() =>{
        if (initializedRef.current) return;
        initializedRef.current = true;
        const initAuth= async () =>{
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            if(storedToken){
                console.log("Attempting to verify token with backend...");
                try{
                   const response=await axios.get(`${BACKEND_URL}/auth/me`, {
                    headers:{
                        Authorization: `Bearer ${storedToken}`
                    }
                   }) ;
                   if (JSON.stringify(response.data.user) !== storedUser) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setUser(response.data.user);
                }
                setToken(storedToken);
                   console.log("User and token set successfully.");
                }catch(error){
                    console.error("Token verification failed:", error);
                    // localStorage.removeItem('token');
                    // localStorage.removeItem('user');
                    // setUser(null);
                    // setToken(null);
                    console.log("Token removed, user and token set to null.");
                }
            }else {
                console.log("No token found in localStorage.");
            }
            setIsLoading(false);
            console.log("isLoading set to false.");
        };
        initAuth();
    },[]);

    useEffect(() => {
        if (!isLoading) {
          const isLoggedIn = !!user;
          console.log("Is user Logged in:", isLoggedIn);
        }
      }, [user, isLoading]);
      

    const login=async (email:string, password:string) =>{
        try {
            const response=await axios.post(`${BACKEND_URL}/auth/signin`,{
                email,password
            });
            const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
            navigate("/")
        } catch (error) {
          throw error;            
        }
    }
    const signup=async (inputs:{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) =>{
        try {
            const response=await axios.post(`${BACKEND_URL}/auth/signup`, inputs);

            const {token, user}=response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            navigate('/')
        } catch (error) {
            throw error;
        }
    };
    const updateUserPhoneNumber = async (phoneNumber: string) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/auth/update-phone`, 
                { phoneNumber },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (user) {
                const updatedUser: User = {
                    ...user,
                    phoneNumber
                };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data;
        } catch (error) {
            console.error('Error updating phone number:', error);
            throw error;
        }
    };

    const logout=() =>{
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate("/auth/signin");
    };

    return(
        <AuthContext.Provider value={{user, token, login,signup, logout,isLoading,updateUserPhoneNumber}}>
             {isLoading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth=() =>{
    const context=useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}