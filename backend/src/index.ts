import express from 'express'
import authRoutes from './routes/auth.js';
import forgotPasswordRoutes from './routes/ForgotPassword.js';
import propertyRoutes from './routes/properties/propertyRoutes.js'
import savedPropertyRoute from "./routes/SavedProperty/savedProperties.js"
import paymentRoutes from "./routes/Payment/paymentRoutes.js"
import mapRouter from "./routes/map/mapRoutes.js"
import bookingRoute from "./routes/booking/bookingRoutes.js"
import availabilityRoutes from './routes/availability/availabilityRoutes.js';
import googleAuthRoute from "./routes/auth/googleAuth.js";
import multer from 'multer';
import updateAvailabilityRoute from './routes/cron/updateAvailability.js';
import { configure } from '@vendia/serverless-express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
const app=express();
app.use(express.json());
app.use(express.text());
const upload = multer();
import cors from "cors";

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://rentpy.vercel.app',
    'https://rentpy-frontend.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'credentials'],
  optionsSuccessStatus: 200,
  preflightContinue: false 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use('/auth', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || corsOptions.origin[0]);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use((req, res, next) => {
  if (req.path.includes('/auth/google')) {
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }
  next();
});
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

app.use("/payment",paymentRoutes);
app.use("/booking", bookingRoute)
app.use("/availability", availabilityRoutes);
app.use("/cron",updateAvailabilityRoute);
// app.post('/webhook', dodoWebhookHandler);

app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

export { app }; 