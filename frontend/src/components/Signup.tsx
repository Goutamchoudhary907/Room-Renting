import { ChangeEvent, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {SignupInput} from '../../../schema/dist/index'
import axios from 'axios';
import {BACKEND_URL} from '../config';
import logo from "../assets/Signup-image.png"
import googleLogo from '../assets/Google-logo.png'
import facebookLogo from '../assets/Facebook-logo.png'
import appleLogo from '../assets/Apple-logo.png'

export const Signup =() =>{
 const navigate= useNavigate();
 const [signupInputs,setSignupInputs]= useState<SignupInput>({
    firstName:"" ,
    lastName:"" ,
    email:"" ,
    password:""
 })

 
 const [errors, setErrors] = useState<{ [key: string]: string }>({});
 useEffect(() => {
  // console.log("Errors state changed:", errors);
}, [errors]);

  async function sendRequest(){
    try {
        const response=await axios.post(`${BACKEND_URL}/auth/signup`, signupInputs);
        const jwt=response.data;
        localStorage.setItem("token",jwt);
         alert("Signup successful.Please sign in");
         navigate("auth/signin");
    }  catch (error) {
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
    }
  }

  const handleChange= (e: ChangeEvent<HTMLInputElement>)=>{
    setSignupInputs({
        ...signupInputs,
        [e.target.id]:e.target.value ,
    })
  };
  console.log("Errors state:", errors);
  return (
    <div className="h-screen flex justify-center items-center bg-gray-200">
      <div className="w-[1000px] h-[600px]  flex rounded-lg bg-white ">
      <div className="w-[40%] flex justify-center items-center ">
        <img  className="max-w-full object-contain"  src={logo} alt="" />
      </div>
       <div className="w-[60%] flex justify-center">
       <div className="w-[350px] mx-auto mt-10"> 
        <div className=' flex justify-center items-center text-[12px] text-[#101011] w-full ml-35'>
           <div> Already have an account ?</div>
           <button onClick={ () => navigate("/auth/signin")} className='text-red-400 cursor-pointer'>Log in</button>
        </div>
        <div className="flex flex-col ">
          <div className="text-[25px] text-[#636AE8] font-bold">
            Sign up
        </div>
        <div className="mt-3 flex flex-col space-y-1 items-center">
          <button className="flex items-center justify-center  border rounded bg-[#DE3B40]  text-white w-[320px] h-[28px]" >
          <div className="w-6 h-6">
            <img src={googleLogo} alt="Google Logo"/>
            </div>
            <span className="text-[12px]">Sign up with Google</span>
            </button>
          <button className="flex items-center border  rounded bg-[#335ca6] justify-center text-white w-[320px] h-[28px]">
            <div className="w-6 h-6">
            <img src={facebookLogo} alt="Facebook Logo" />
            </div>
            <span className="text-[12px]">Sign up with Facebook</span>
            </button>
          <button className="flex items-center border  rounded bg-[#9095a0] justify-center space-x-2 text-white w-[320px] h-[28px]">
          <div className="w-6 h-6">
          <img src={appleLogo} alt="Apple Logo"/>
          </div>
          <span className="text-[12px]">Sign up with Apple</span>
            </button>
        </div>
        <div className="relative mt-4 flex items-center justify-center">
          <div className="border-t w-1/2 border-gray-300"></div>
          <span className="bg-white px-4 text-gray-500 text-[11px]">OR</span>
          <div className="border-t w-1/2 border-gray-300"></div>
        </div>

        <div className="flex space-x-4 mt-4 ">
          <InputField label="First Name" id="firstName" placeholder="Input first name"  className="w-[168px]"
           onChange={handleChange} 
           errorMessage={errors.firstName}
           />
          <InputField label="Last Name" id="lastName" placeholder="Input last name" className="w-[168px]"
           onChange={handleChange}
           errorMessage={errors.lastName}
           />
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
        {errors.general && <p className="text-red-500">{errors.general}</p>}
       
        <div className="flex items-center mt-4">
          <input type="checkbox"  id="myCheckBox" className="mr-2"/>
          <label htmlFor="myCheckBox" className="text-[12px] text-[#171a1f]">
          By signing up, I agree with the Terms of Use & Privacy Policy
          </label>
        </div>

        <div>
          <button onClick={sendRequest} className="bg-[#636ae8] hover:bg-[#000000] text-white font-bold py-2 px-4 rounded mt-4 w-[350px] cursor-pointer transition-colors duration-300">
            Create an account
            </button>
        </div>

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
      <label htmlFor={id} className="text-[13px] font-bold text-[#424854ff]">
        {label}
      </label>
      <input 
      onChange={onChange}
      type="text"
      id={id}
      placeholder={placeholder}
      className={` p-2 rounded-md text-[13.5px] bg-[#f6f6f8] placeholder-[#bcc1ca] ${className || ''} flex-1`}
      />
      <span
        className={`text-red-500 text-xs mt-1 ${errorMessage ? '' : 'error-hidden'}`}
      >
        {errorMessage}
      </span>
       </div>
  )
 } 