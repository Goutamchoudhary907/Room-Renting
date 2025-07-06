import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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
    loginWithGoogle: (credential: string) => Promise<void>;
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
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);
    const [token, setToken] = useState<string | null>(storedToken);
    const [isLoading, setIsLoading] = useState(!storedUser || !storedToken);
    const navigate = useNavigate();
    const initializedRef = useRef(false);

    useEffect(() =>{
        if (initializedRef.current) return;
        initializedRef.current = true;
        const initAuth= async () =>{
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            if(storedToken){
                try{
                   const response=await axios.get(`${BACKEND_URL}/auth/me`, {
                    headers:{
                        Authorization: `Bearer ${storedToken}`
                    },
                  withCredentials: true 
                   }) ;
                   
                  const backendUser = response.data.user;
                 setUser(backendUser);
                 localStorage.setItem('user', JSON.stringify(backendUser));

                setToken(storedToken);
                }catch(error){
                    console.error("Token verification failed:", error);
                }
            }else {
                console.log("No token found in localStorage.");
            }
            setIsLoading(false);
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
            },
      { withCredentials: true });
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
            const response=await axios.post(`${BACKEND_URL}/auth/signup`, inputs,
      { withCredentials: true });

            const {token, user}=response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
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
                    },
       withCredentials: true 
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

    const loginWithGoogle = async (credential: string) => {
      try {
        const response = await axios.post(`${BACKEND_URL}/login/google`, {
          credential
        });
    
        const { token, user } = response.data;
    
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    
        flushSync(() => {
          setToken(token);
          setUser(user);
        });
    
        navigate("/");
    
      } catch (error) {
        console.error('Google login failed:', error);
        throw error;
      }
    };

    
    const logout=() =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate("/auth/signin");
    };

    return(
        <AuthContext.Provider value={{user, token, login,signup, logout,isLoading,updateUserPhoneNumber,loginWithGoogle}}>
              {children}
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