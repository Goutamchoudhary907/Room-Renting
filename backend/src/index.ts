import express from 'express'
import authRoutes from './routes/auth.js';
import forgotPasswordRoutes from './routes/ForgotPassword.js';
import propertyRoutes from './routes/properties/propertyRoutes.js'
import multer from 'multer';
const app=express();

app.use(express.json());
app.use(express.text());
const upload = multer();
import cors from "cors";

app.use(cors());
app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    // Convert string numbers to actual numbers
    const numericFields = ['bedrooms', 'bathrooms', 'pricePerNight', 'pricePerMonth'];
    numericFields.forEach(field => {
      if (req.body[field] !== undefined) {
        req.body[field] = Number(req.body[field]);
      }
    });
  }
  next();
});
app.use("/auth", authRoutes);
app.use("", forgotPasswordRoutes)
app.use("/property", propertyRoutes)

app.listen(3000,() =>{
    console.log('Server running on http://localhost:3000');
});
