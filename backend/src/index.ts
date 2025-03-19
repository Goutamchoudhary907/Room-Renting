import express from 'express'
import authRoutes from './routes/auth.js';
import forgotPasswordRoutes from './routes/ForgotPassword.js';
import propertyRoutes from './routes/properties/propertyRoutes.js'

const app=express();

app.use(express.json());
app.use(express.text());
import cors from "cors";
app.use(cors());
app.use("/auth", authRoutes);
app.use("", forgotPasswordRoutes)
app.use("/property", propertyRoutes)

app.listen(3000,() =>{
    console.log('Server running on http://localhost:3000');
});
