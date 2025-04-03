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
    // Convert all numeric fields from strings to numbers
    const numericFields = ['bedrooms', 'bathrooms', 'pricePerNight', 'pricePerMonth', 'maxGuests'];
    
    numericFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        const numValue = Number(req.body[field]);
        if (!isNaN(numValue)) {
          req.body[field] = numValue;
        } else {
          console.warn(`Failed to convert ${field} to number:`, req.body[field]);
        }
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
