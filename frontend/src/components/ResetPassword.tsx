import { ChangeEvent, useState } from "react"
import { ResetPasswordInput } from "../../../schema/dist";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import {z} from 'zod'
export const ResetPassword =()=>{
    console.log("ResetPassword component is rendering"); // Add this line!

  
 const navigate=useNavigate();
 const location=useLocation();
 const searchParams=new URLSearchParams(location.search);
 const token=searchParams.get('token');
    
 const[resetPasswordInputs,setResetPasswordInputs]=useState<ResetPasswordInput>({
    password:"" ,
    confirmPassword:""
 })

 const [errors,setErrors]=useState<{[key:string]:string}>({});
 
 const handleChange=(e:ChangeEvent<HTMLInputElement>) =>{
     setResetPasswordInputs({
        ...resetPasswordInputs ,
        [e.target.name]:e.target.value ,
     })
 }

async function sendRequest(){

    try {
        if(!token){
            setErrors({general:"Invalid or missing token."})
            return;
        }

        const response=await axios.post(`${BACKEND_URL}/reset-password`,{
            password: resetPasswordInputs.password,
            confirmPassword: resetPasswordInputs.confirmPassword,
            token: token,
        });

        if(response.status >=200 && response.status <300){
            alert("Password reset successful!");
            navigate("/login");
        }else if(response.status===400 && response.data.errors){
         setErrors(response.data.errors);
        }else{
            setErrors({general:`request failed with status: ${response.status}`})
        }
    } catch (error:any) {
        if(error instanceof z.ZodError){
            const mappedErrors:{[key:string]:string} ={};
            error.errors.forEach((err) =>{
                mappedErrors[err.path[0]]=err.message;
            });
            setErrors(mappedErrors);
        }else if(axios.isAxiosError(error)){
            if(error.response){
                if(error.response.data.errors && typeof error.response.data.errors==='object'){
                    setErrors(error.response.data.errors);
                }else{
                    setErrors({general:error.response.data.message});
                }
            }else{
                setErrors({ general: 'Network error. Please try again.' });
            }
        }else {
            setErrors({ general: "An unexpected error occurred. Please try again" });
            console.error('Non-Axios error:', error);
        }
    }  
}
return(
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-96 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                Reset Password
            </h2>
            {errors.general && <p className="text-red-500 mb-3 text-center">{errors.general}</p>}
            {errors.password && <p className="text-red-500 mb-3 text-center">{errors.password}</p>}
            {errors.confirmPassword && <p className="text-red-500 mb-3 text-center">{errors.confirmPassword}</p>}

        <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
            </label>
            <input 
                type="password"
                name="password"
                value={resetPasswordInputs.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-300"
                placeholder="Enter your new password"  />
        </div>
        <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
            </label>
            <input type="password"
            name="confirmPassword"
            value={resetPasswordInputs.confirmPassword} 
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-300"
            placeholder="Confirm your new password"
            />
        </div>
        <button 
        onClick={sendRequest}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
            Reset Password
        </button>
        </div>
    </div>
)

}