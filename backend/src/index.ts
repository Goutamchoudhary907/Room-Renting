import express from 'express'
import authRoutes from './routes/auth';
import forgotPasswordRoutes from './routes/ForgotPassword';
import propertyRoutes from './routes/properties/propertyRoutes'

const app=express();
const cors=require('cors');

app.use(express.json());
app.use(express.text());
app.use(cors());
app.use("/auth", authRoutes);
app.use("", forgotPasswordRoutes)
app.use("/property", propertyRoutes)

app.listen(3000,() =>{
    console.log('Server running on http://localhost:3000');
});
