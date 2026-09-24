import { ChangeEvent, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { SigninInput } from '../../../schema/src/authSchema.js';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { SigninSkeleton } from '../skeletons/auth/SigninSkeleton';
import {
  AuthDivider,
  AuthField,
  AuthLayout,
  AuthLegal,
  AuthSubmitButton,
} from '../../components/Auth/AuthLayout';
import { EyeIcon, EyeOffIcon, LockIcon, LoginIcon, MailIcon } from '../../components/Home/icons';

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
    const [showPassword, setShowPassword] = useState(false);

    async function sendRequest(){
        setIsSubmitting(true);
        try {
          await login(signinInputs.email, signinInputs.password);
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect") || "/";
            navigate(redirect);
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
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";

    return (
      <AuthLayout
        panelTitle="Find your perfect stay"
        panelText="500+ verified rooms across 4 cities, with transparent pricing and instant booking."
      >
        {/* Header */}
        <div className="mb-9">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber/15 bg-amber/8 px-3.5 py-1.5">
            <LoginIcon className="text-amber" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-amber">
              Welcome back
            </span>
          </div>
          <h1 className="m-0 mb-2 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink">
            Sign in to your account
          </h1>
          <p className="m-0 font-sans text-sm text-taupe">
            Don't have an account?{' '}
            <button
              onClick={() => navigate(`/auth/signup?redirect=${redirect}`)}
              className="cursor-pointer border-none bg-transparent p-0 font-sans text-sm font-semibold text-amber hover:text-amber-dark"
            >
              Create one
            </button>
          </p>
        </div>

        {/* Google sign-in (rendered by Google, so it keeps its own styling) */}
        <div className="mb-7 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                try {
                  await loginWithGoogle(credentialResponse.credential);
                  const params = new URLSearchParams(window.location.search);
                  const redirect = params.get("redirect") || "/";
                  navigate(redirect);
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
            width="400"
          />
        </div>

        <AuthDivider label="or continue with email" />

        {/* Form */}
        <div className="mb-7 flex flex-col gap-5">
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
            label="Password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={<LockIcon />}
            onChange={handleChange}
            errorMessage={errors.password}
            labelAction={
              <button
                onClick={() => navigate("/auth/forgot-password")}
                className="cursor-pointer border-none bg-transparent p-0 font-sans text-xs font-semibold text-amber hover:text-amber-dark"
              >
                Forgot?
              </button>
            }
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
          loadingText="Logging in..."
        >
          Sign In
        </AuthSubmitButton>

        <AuthLegal prefix="By continuing you agree to our" />
      </AuthLayout>
      )
}
