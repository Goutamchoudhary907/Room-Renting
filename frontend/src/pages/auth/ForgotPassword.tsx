import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useLoading } from "../../context/LoadingContext";
import { ForgotPasswordSkeleton } from "../skeletons/auth/ForgotPasswordSkeleton";
import { useAuth } from "../../context/AuthContext";
import {
  AuthField,
  AuthLayout,
  AuthSubmitButton,
} from "../../components/Auth/AuthLayout";
import { ArrowRightIcon, KeyIcon, LockIcon, MailIcon } from "../../components/Home/icons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const ForgotPassword= () =>{
    const navigate= useNavigate();
   const { isLoading,setLoading } = useLoading();
    const { isLoading: isAuthLoading } = useAuth();
    const [email,setEmail]= useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange=(e:ChangeEvent<HTMLInputElement>) =>{
        const inputValue = e.target.value;
        setEmail(inputValue)
    }

   async function sendRequest(){
    setLoading(true);
   try {
    const response=await axios.post(`${BACKEND_URL}/auth/forgot-password`,email,
        { headers: { "Content-Type": "text/plain" } }
    );
    if (response.status >= 200 && response.status < 300) {
        alert("Password reset email sent!");
        navigate("/");
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
   }finally{
    setLoading(false);
   }
   }

   if(isLoading || isAuthLoading){
    return <ForgotPasswordSkeleton/>
   }

return(
    <AuthLayout
      panelTitle="Don't worry"
      panelText="It happens to the best of us. We'll send you a link to reset your password in seconds."
      panelIcon={<LockIcon size={32} strokeWidth={1.5} />}
      showStats={false}
      backTo="/auth/signin"
      backLabel="Back to sign in"
    >
      {/* Header */}
      <div className="mb-9">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/12 px-3.5 py-1.5">
          <KeyIcon size={14} className="text-[#a08620]" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#a08620]">
            Reset password
          </span>
        </div>
        <h1 className="m-0 mb-2 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink">
          Forgot your password?
        </h1>
        <p className="m-0 font-sans text-sm leading-relaxed text-taupe">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <div className="mb-7">
        <AuthField
          label="Email address"
          id="email"
          type="email"
          placeholder="you@example.com"
          icon={<MailIcon />}
          value={email}
          onChange={handleChange}
          errorMessage={errors.email}
        />
      </div>

      {errors.general && (
        <p className="m-0 mb-4 rounded-xl bg-red-50 px-3.5 py-3 font-sans text-[13px] text-red-600">
          {errors.general}
        </p>
      )}

      <AuthSubmitButton onClick={sendRequest} loadingText="Sending...">
        <>
          Send Reset Link
          <ArrowRightIcon />
        </>
      </AuthSubmitButton>

      <p className="m-0 mt-6 text-center font-sans text-[13px] text-taupe">
        Remember your password?{' '}
        <Link to="/auth/signin" className="font-semibold text-amber hover:text-amber-dark">
          Sign in
        </Link>
      </p>
    </AuthLayout>
)
}
