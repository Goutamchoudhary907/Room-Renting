import z from "zod"

export const signupInput=z.object({
    firstName:z.string().trim().min(1 , {message:"Please enter your first name."}) ,
    lastName:z.string().trim().min(1, { message: "Please enter your last name." }) ,
    email:z.string().trim().email({ message: "Please enter a valid email address." }) ,
    password:z.string().min(8, { message: "Password must be at least 8 characters." }) 
})


export const signinInput=z.object({
    email:z.string().trim().email({ message: "Please enter a valid email address." }) ,
    password:z.string().min(8,{ message: "Password must be at least 8 characters." }) ,
})

export const forgotPasswordInput=z.string().trim().email({ message: "Please enter a valid email address." })

export const resetPasswordInput=z.object({
    password:z.string().trim().min(8,{ message: "Password must be at least 8 characters." }) ,
    confirmPassword:z.string().trim().min(8),
}) 
.refine((data) => data.password===data.confirmPassword , {
    message:"Passwords don't match" ,
    path:["confirmPassword"] ,
})

export type SignupInput=z.infer<typeof signupInput>
export type SigninInput=z.infer<typeof signinInput>
export type ForgotPasswordInput=z.infer<typeof forgotPasswordInput>
export type ResetPasswordInput=z.infer<typeof resetPasswordInput>