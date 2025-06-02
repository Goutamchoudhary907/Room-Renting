import z from "zod"
const phoneNumberSchema = z.string()
  .trim()
  .optional()   
  .refine(val => {
    if (!val) return true;  
    return /^[0-9]+$/.test(val) && val.length >= 10 && val.length <= 15;
  }, {
    message: "Phone number must be between 10 and 15 digits and contain digits only"
  });
export const signupInput=z.object({
    firstName:z.string().trim().min(1 , {message:"Please enter your first name."}) ,
    lastName:z.string().trim().min(1, { message: "Please enter your last name." }) ,
    email:z.string().trim().email({ message: "Please enter a valid email address." }) ,
    password:z.string().min(8, { message: "Password must be at least 8 characters." }),
    phoneNumber:phoneNumberSchema 
})
export const updatePhoneInput=z.object({
    phoneNumber:phoneNumberSchema
})

export const signinInput=z.object({
    email:z.string().trim().email({ message: "Please enter a valid email address." }) ,
    password:z.string().min(8,{ message: "Password must be at least 8 characters." }) ,
})

export const forgotPasswordInput=z.string().trim().email({ message: "Please enter a valid email address." })

export const resetPasswordInput=z.object({
    password:z.string().trim().min(8,{ message: "New password must be at least 8 characters." }) ,
    confirmPassword:z.string().trim().min(8,{ message: "Confirm password must be at least 8 characters." }),
}) 
.refine((data) => data.password===data.confirmPassword , {
    message:"Passwords don't match" ,
    path:["confirmPassword"] ,
})

export type SignupInput=z.infer<typeof signupInput>
export type SigninInput=z.infer<typeof signinInput>
export type UpdatePhoneInput=z.infer<typeof updatePhoneInput>
export type ForgotPasswordInput=z.infer<typeof forgotPasswordInput>
export type ResetPasswordInput=z.infer<typeof resetPasswordInput>