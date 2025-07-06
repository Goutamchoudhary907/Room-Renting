import { ChangeEvent, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import logo from "../../assets/Signup-image.png"
import facebookLogo from '../../assets/Facebook-logo.png'
import appleLogo from '../../assets/Apple-logo.png'
import { SigninInput } from '../../../schema/src/authSchema.js';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { SigninSkeleton } from '../skeletons/auth/SigninSkeleton';

export const Signin =()=>{
   const { login,loginWithGoogle  } = useAuth();
   const { isLoading: isAuthLoading } = useAuth();
    const navigate= useNavigate();

    const [signinInputs,setSigninInputs]= useState<SigninInput>({
       email:"" ,
       password:""
    })

     const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    async function sendRequest(){
        setIsSubmitting(true);
        try {
          await login(signinInputs.email, signinInputs.password); 
            navigate("/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response) {
                if (error.response.data.errors && typeof error.response.data.errors === 'object') {
                  setErrors(error.response.data.errors);
                } else {
                  setErrors({ general: error.response.data.message });
                }
              } else {
                setErrors({ general: 'Network error. Please try again.' });
              }
            } else {
              setErrors({ general: "An unexpected error occurred. Please try again.'" });
              console.error('Non-Axios error:', error);
            }
          }finally{
             setIsSubmitting(false);
          }
      }
    
      const handleChange= (e: ChangeEvent<HTMLInputElement>)=>{
        setSigninInputs({
            ...signinInputs,
            [e.target.id]:e.target.value ,
        })
      };

      if(isAuthLoading){
        return <SigninSkeleton/>
      }
    return (
      <div className="min-h-screen flex justify-center items-start pt-4 md:pt-8 bg-gray-200 p-4">  <div className="w-[1000px] h-[600px] lg:w-full lg:max-w-[1000px] lg:h-auto lg:min-h-[600px] flex rounded-lg bg-white lg:flex-row flex-col max-lg:h-full max-lg:w-full max-lg:rounded-none ">
      <div className="w-[40%] lg:flex justify-center items-center hidden max-lg:hidden">
      <img  className="max-w-full object-contain"  src={logo} alt="" />
  </div>
  <div className="w-[60%] lg:w-[60%] flex justify-center lg:py-0 py-8 max-lg:w-full max-lg:px-4 max-lg:py-6">
  <div className="w-[350px] mx-auto lg:mt-10 mt-0 max-lg:w-full max-lg:max-w-[350px]">
  <div className='flex justify-center items-center text-[12px] text-[#101011] w-full lg:ml-35 max-lg:flex-wrap max-lg:text-center max-lg:gap-1'>
  <div> Don't have an account ?</div>
       <button onClick={ () => navigate("/auth/signup")} className='text-red-400 cursor-pointer'>Sign up</button>
    </div>
    <div className="flex flex-col ">
      <div className="text-[25px] text-[#636AE8] font-bold mt-5 lg:mt-0 lg:text-left text-center">
        Sign in
    </div>
    <div className="mt-3 flex flex-col space-y-1 items-center">
              <GoogleLogin
   onSuccess={async (credentialResponse) => {
                     if (credentialResponse.credential) {
                       try {
                        await loginWithGoogle(credentialResponse.credential);
                         window.location.href = "/"; 
                       } catch (err) {
                         console.error("Backend login error:", err);
                       }
                     } else {
                       console.error("No credential received");
                     }
                   }}
                   onError={() => {
                     console.log("Google Login Failed");
                   }} 
                  />
              <button className="flex items-center border rounded bg-[#335ca6] justify-center text-white w-full h-10 md:h-[28px] lg:w-[320px] lg:mt-3 max-lg:h-10 max-lg:text-sm">
              <div className="w-5 h-5 md:w-6 md:h-6">
                <img src={facebookLogo} alt="Facebook Logo" />
                </div>
                <span className="text-xs md:text-[12px]">Login with Facebook</span>
                </button>
                <button className="flex items-center border rounded bg-[#9095a0] justify-center text-white w-full h-10 md:h-[28px] lg:w-[320px] max-lg:h-10 max-lg:text-sm">
                <div className="w-5 h-5 md:w-6 md:h-6">
              <img src={appleLogo} alt="Apple Logo"/>
              </div>
              <span className="text-xs md:text-[12px] ml-2">Login with Apple</span>
                </button>
            </div>

            <div className="relative mt-4 flex items-center justify-center max-lg:mt-6">
            <div className="border-t w-1/2 border-gray-300"></div>
              <span className="bg-white px-4 text-gray-500 text-xs md:text-[11px]">OR</span>
              <div className="border-t w-1/2 border-gray-300"></div>
              </div>
    
            <div className="w-full mt-4">
            <InputField label="Email" id="email" placeholder="example.email@gmail.com"
             onChange={handleChange}
             errorMessage={errors.email}
             />
            </div>
            
            <div className="w-full mt-4">
            <InputField label="Password" id="password" placeholder="Enter at least 8+ characters"
             onChange={handleChange}
             errorMessage={errors.password}
             />
            </div>
            {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}
           
            <div className="flex flex-row items-center justify-between mt-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <input type="checkbox"  id="myCheckBox" className="mr-2 cursor-pointer"/>
              <label htmlFor="myCheckBox" className="text-xs md:text-[12px] text-[#171a1f] cursor-pointer">
                  Remember me
              </label>
              </div>

              
              <button onClick={() => navigate("/auth/forgot-password")} className='text-xs md:text-[13px] text-[#636AE8] cursor-pointer'>
              Forgot Password?
               </button>
            </div>
    
          <button
      onClick={sendRequest}
      disabled={isSubmitting}
      className={`bg-[#636ae8] hover:bg-[#000000] text-white font-bold py-2 px-4 rounded mt-4 w-full cursor-pointer transition-colors duration-300 max-lg:text-sm max-lg:py-2 ${
        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging in...
        </span>
      ) : (
        'Login'
      )}
    </button>

    
           </div>
           </div>
           </div>
          </div>
        </div>
      )
}

interface InputFieldType{
  label:string;
  placeholder:string;
  id:string;
  className?:string;
  onChange:(e:ChangeEvent<HTMLInputElement>)=> void;
  errorMessage?:string;
}

function InputField ({label,placeholder, id, className,onChange, errorMessage}:InputFieldType){
  return (
    <div className="flex flex-col">
     <label htmlFor={id} className="text-xs md:text-[13px] font-bold text-[#424854ff] mb-1">
        {label}
      </label>
      <input
  onChange={onChange}
  type="text"
  id={id}
  placeholder={placeholder}
  className={`p-2 rounded-md text-xs md:text-[13.5px] bg-[#f6f6f8] placeholder-[#bcc1ca] ${className || ''} w-full max-lg:text-sm max-lg:p-2`}
/>

      <span
        className={`text-red-500 text-xs mt-1 ${errorMessage ? '' : 'error-hidden'}`}
      >
        {errorMessage}
      </span>
       </div>
  )
}