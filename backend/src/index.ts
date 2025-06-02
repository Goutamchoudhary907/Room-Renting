import express from 'express'
import authRoutes from './routes/auth.js';
import forgotPasswordRoutes from './routes/ForgotPassword.js';
import propertyRoutes from './routes/properties/propertyRoutes.js'
import savedPropertyRoute from "./routes/SavedProperty/savedProperties.js"
import paymentRoutes from './routes/Payment/paymentRoutes.js'
import mapRouter from "./routes/map/mapRoutes.js"
import dodoWebhookHandler from './services/webhook.js'; 
import googleAuthRoute from "./routes/auth/googleAuth.js";
import multer from 'multer';
const app=express();

app.use(express.json());
app.use(express.text());
app.use('/webhook', express.raw({ type: 'application/json' }));
const upload = multer();
import cors from "cors";
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true, 
  allowedHeaders: 'Content-Type,Authorization', 
  maxAge: 3600,
};
app.use(cors(corsOptions));
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
app.use("/", googleAuthRoute);
app.use("", forgotPasswordRoutes)
app.use("/property", propertyRoutes)
app.use("/",savedPropertyRoute);

app.use("/map",mapRouter);

app.use("/booking",paymentRoutes);
app.post('/webhook', dodoWebhookHandler);

export default app;