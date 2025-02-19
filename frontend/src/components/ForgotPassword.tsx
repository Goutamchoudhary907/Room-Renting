import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const ForgotPassword= () =>{
    const navigate= useNavigate();

    const [email,setEmail]= useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange=(e:ChangeEvent<HTMLInputElement>) =>{
        const inputValue = e.target.value;
        setEmail(inputValue)
    }

   async function sendRequest(){
   try {
    console.log("Email State:", email);
    const response=await axios.post(`${BACKEND_URL}/auth/forgot-password`,email,
        { headers: { "Content-Type": "text/plain" } }
    );
    if (response.status >= 200 && response.status < 300) {
        alert("Password reset email sent!");
        navigate("/home"); 
    } else {
        setErrors({ general: `Request failed with status: ${response.status}` });
    }
   } catch (error:any) {
    if(axios.isAxiosError(error)){
        if(error.response){
            if(error.response.data.errors && typeof error.response.data.errors==='object'){
                setErrors(error.response.data.errors);
            }else{
                setErrors({general:error.response.data.message});
            }
        }else{
            setErrors({ general: 'Network error. Please try again.' });
        }
    }else{
        setErrors({general:"An unexpected error occurred . Please try again"});
        console.error('Non-Axios error:', error);
    }
   }
   } 
   
return(
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-96 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text -2xl font-semibold mb-4 text-center text-gray-800">
                Forgot Password
            </h2>
            <p className="text-gray-600 mb-4 text-center">
            Enter your email address and we'll send you instructions to reset your
            password.
            </p>
            {errors.general && <p className="text-red-500 mb-3 text-center">{errors.general}</p>}
            {errors.email && <p className="text-red-500 mb-3 text-center">{errors.email}</p>}

        <div className="mb-4">
            <label htmlFor="email"
            className="blcok text-sm font-medium text-gray-700"
            >
            Email address
            </label>

            <input type="email" 
            id="email"
            value={email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md  focus:ring focus:ring-blue-200 focus:border-blue-300"
            placeholder="Enter your email address"
            />

            <button onClick={sendRequest}
             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >Send Email</button>
            </div>    
        </div>
    </div>
)
}
