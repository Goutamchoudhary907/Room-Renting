import { ChangeEvent, useState } from "react"
import { ResetPasswordInput } from "../../../schema/src/authSchema.js";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {z} from 'zod'
import { useLoading } from "../../context/LoadingContext";
import { ResetPasswordSkeleton } from "../skeletons/auth/ResetPasswordSkeleton ";
import { useAuth } from "../../context/AuthContext";
import {
  AuthField,
  AuthLayout,
  AuthSubmitButton,
} from "../../components/Auth/AuthLayout";
import { EyeIcon, EyeOffIcon, KeyIcon, LockIcon } from "../../components/Home/icons";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const ResetPassword =()=>{
 const navigate=useNavigate();
 const location=useLocation();
 const searchParams=new URLSearchParams(location.search);
 const token=searchParams.get('token');
 const { isLoading,setLoading } = useLoading();
  const { isLoading: isAuthLoading } = useAuth();

 const[resetPasswordInputs,setResetPasswordInputs]=useState<ResetPasswordInput>({
    password:"" ,
    confirmPassword:""
 })

 const [errors,setErrors]=useState<{[key:string]:string}>({});
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirm, setShowConfirm] = useState(false);

 const handleChange=(e:ChangeEvent<HTMLInputElement>) =>{
     setResetPasswordInputs({
        ...resetPasswordInputs ,
        [e.target.name]:e.target.value ,
     })
 }

async function sendRequest(){
    setLoading(true);
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
            navigate("/auth/signin");
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
    }finally{
        setLoading(false);
    }
}

if(isLoading || isAuthLoading){
    return <ResetPasswordSkeleton/>
}

return(
    <AuthLayout
      panelTitle="Almost there"
      panelText="Choose a new password and you'll be back in your account in a moment."
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
            New password
          </span>
        </div>
        <h1 className="m-0 mb-2 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink">
          Reset your password
        </h1>
        <p className="m-0 font-sans text-sm leading-relaxed text-taupe">
          Pick a strong password you haven't used before.
        </p>
      </div>

      {/* Form */}
      <div className="mb-7 flex flex-col gap-5">
        <AuthField
          label="New password"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your new password"
          icon={<LockIcon />}
          value={resetPasswordInputs.password}
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
        <AuthField
          label="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm your new password"
          icon={<LockIcon />}
          value={resetPasswordInputs.confirmPassword}
          onChange={handleChange}
          errorMessage={errors.confirmPassword}
          trailing={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="flex cursor-pointer items-center border-none bg-transparent p-1 text-taupe-light hover:text-ink"
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon size={18} />}
            </button>
          }
        />
      </div>

      {errors.general && (
        <p className="m-0 mb-4 rounded-xl bg-red-50 px-3.5 py-3 font-sans text-[13px] text-red-600">
          {errors.general}
        </p>
      )}

      <AuthSubmitButton onClick={sendRequest} loadingText="Resetting...">
        Reset Password
      </AuthSubmitButton>

      <p className="m-0 mt-6 text-center font-sans text-[13px] text-taupe">
        Remembered it?{' '}
        <Link to="/auth/signin" className="font-semibold text-amber hover:text-amber-dark">
          Sign in
        </Link>
      </p>
    </AuthLayout>
)

}
