import { ChangeEvent, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {SignupInput} from '../../../schema/src/authSchema.js'
import axios from 'axios';
import googleLogo from '../../assets/Google-logo (2).png'
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { SigninSkeleton } from '../skeletons/auth/SigninSkeleton';
import {
  AuthDivider,
  AuthField,
  AuthLayout,
  AuthLegal,
  AuthSubmitButton,
} from '../../components/Auth/AuthLayout';
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  UserPlusIcon,
} from '../../components/Home/icons';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Signup =() =>{
 const navigate= useNavigate();
   const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";
 const [signupInputs,setSignupInputs]= useState<SignupInput>({
    firstName:"" ,
    lastName:"" ,
    email:"" ,
    password:"" ,
    phoneNumber:""
 })

 const { signup } = useAuth();

 const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const { isLoading: isAuthLoading } = useAuth();
 const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 useEffect(() => {
}, [errors]);

  async function sendRequest(){
   setIsSubmitting(true);
    try {
       await signup(signupInputs)
        navigate(redirect);
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
    }finally {
     setIsSubmitting(false);
    }
  }

  const handleChange= (e: ChangeEvent<HTMLInputElement>)=>{
    setSignupInputs({
        ...signupInputs,
        [e.target.id]:e.target.value ,
    })
  };


const login = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
     setIsGoogleLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/google`, {
        accessToken: tokenResponse.access_token,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
     navigate(redirect);
    } catch (err) {
      console.error("Backend signup error:", err);
      setErrors({ general: "Google signup failed. Try again." });
    }finally{
      setIsGoogleLoading(false);
    }
  },
  onError: () => console.log("Google Signup Failed"),
});
if (isAuthLoading) {
  return <SigninSkeleton />;
}

  return (
    <AuthLayout
      panelTitle="List, book and stay"
      panelText="Join Rentpy to book verified rooms or earn by renting out your own space."
    >
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-verified/15 bg-verified/8 px-3.5 py-1.5">
          <UserPlusIcon className="text-verified" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-verified">
            Create account
          </span>
        </div>
        <h1 className="m-0 mb-2 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink">
          Get started with Rentpy
        </h1>
        <p className="m-0 font-sans text-sm text-taupe">
          Already have an account?{' '}
          <button
            onClick={() => navigate(`/auth/signin?redirect=${redirect}`)}
            className="cursor-pointer border-none bg-transparent p-0 font-sans text-sm font-semibold text-amber hover:text-amber-dark"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Google */}
      <div className="mb-6">
        <button
          onClick={() => login()}
          disabled={isGoogleLoading}
          className={`flex w-full items-center justify-center gap-2.5 rounded-[14px] border border-cream-border bg-white px-5 py-[13px] font-sans text-[13px] font-semibold text-ink transition-all duration-[250ms] ${
            isGoogleLoading
              ? 'cursor-not-allowed opacity-75'
              : 'cursor-pointer hover:border-amber hover:shadow-[0_4px_12px_rgba(181,112,60,0.1)]'
          }`}
        >
          {isGoogleLoading ? (
            <span className="flex items-center justify-center">
              <svg className="-ml-1 mr-3 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing up...
            </span>
          ) : (
            <>
              <img src={googleLogo} alt="" className="h-[18px] w-[18px]" />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      <AuthDivider label="or with email" />

      {/* Form fields */}
      <div className="mb-7 flex flex-col gap-[18px]">
        <div className="flex flex-col gap-[18px] sm:flex-row sm:gap-3">
          <div className="flex-1">
            <AuthField
              label="First name"
              id="firstName"
              placeholder="John"
              icon={<UserIcon />}
              onChange={handleChange}
              errorMessage={errors.firstName}
            />
          </div>
          <div className="flex-1">
            <AuthField
              label="Last name"
              id="lastName"
              placeholder="Doe"
              onChange={handleChange}
              errorMessage={errors.lastName}
            />
          </div>
        </div>

        <AuthField
          label="Email address"
          id="email"
          type="email"
          placeholder="you@example.com"
          icon={<MailIcon />}
          onChange={handleChange}
          errorMessage={errors.email}
        />

        <AuthField
          label="Phone number"
          id="phoneNumber"
          type="tel"
          placeholder="+91 98765 43210"
          icon={<PhoneIcon />}
          onChange={handleChange}
          errorMessage={errors.phoneNumber}
        />

        <AuthField
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter at least 8+ characters"
          icon={<LockIcon />}
          onChange={handleChange}
          errorMessage={errors.password}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="flex cursor-pointer items-center border-none bg-transparent p-1 text-taupe-light hover:text-ink"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon size={18} />}
            </button>
          }
        />
      </div>

      {errors.general && (
        <p className="m-0 mb-4 rounded-xl bg-red-50 px-3.5 py-3 font-sans text-[13px] text-red-600">
          {errors.general}
        </p>
      )}

      <AuthSubmitButton
        onClick={sendRequest}
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingText="Creating account..."
      >
        Create Account
      </AuthSubmitButton>

      <AuthLegal prefix="By creating an account you agree to our" />
    </AuthLayout>
  )
 }
