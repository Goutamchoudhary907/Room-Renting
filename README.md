
# 🏠 Rentpy

**Rentpy** is a rental marketplace platform designed to help users find and book rooms or properties for short-term and long-term stays. It offers an intuitive interface, advanced search filters, secure payments, and a smooth booking experience.

---

## ✨ Features

- **Property Listings:** Browse all available properties with images, pricing, and rental type.  
- **Search & Filters:** Search properties by location, check-in/check-out dates, rental type, and other criteria.  
- **Property Details:** View full property information including amenities, pricing, and map location.  
- **Map Integration:** Google Maps integration to display property locations.  
- **Payments:** Secure **Razorpay** integration for bookings and rental payments.  
- **Authentication:** User login and registration for secure access.  
- **Responsive UI:** Fully responsive frontend using React and Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer       | Technology                                                                 |
|------------|----------------------------------------------------------------------------|
| Frontend   | React, TypeScript, Tailwind CSS, @react-google-maps/api (**Deployed on Vercel**) |
| Backend    | Node.js, Express, TypeScript (**Deployed on Render**)                       |
| Database   | PostgreSQL                                                                 |
| APIs & Integrations | Google Maps Services (autocomplete, geocoding, directions), Razorpay for payments |

---

## 🏗️ Architecture Overview

### Frontend
- Built with React + TypeScript and styled with Tailwind CSS.  
- Components for property display, filters, and map visualization.  
- Communicates with backend via REST APIs.  
- **Deployment:** Vercel for fast and reliable hosting.

### Backend
- Node.js + Express REST API with endpoints:  
  - `/property/all` → Fetch all properties  
  - `/property/search` → Fetch filtered properties  
- Connected to **PostgreSQL** for property and user data.  
- Handles authentication, property filtering, and business logic.  
- **Deployment:** Render with secure environment variables.

---
## 🚀 Getting Started / Run Locally  

Follow these steps to run **Rentpy** on your local machine.  

### Prerequisites  
- Node.js (v16 or higher recommended)  
- npm or yarn  
- PostgreSQL database  
- Git  

---

### 1. Clone the repository  
```bash
git clone https://github.com/Goutamchoudhary907/Room-Renting.git
cd Room-Renting
```

### 2. Backend Setup
Navigate to backend folder
```bash
cd backend
```
Install dependencies
```bash
npm install
```

### Configure Environment Variables / Create `.env` File
```bash
touch .env
```
Add your credentials to .env :
```bash
env
BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your_jwt_secret"
SENDGRID_API_KEY="your_sendgrid_api_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
RAZORPAY_API_KEY="your_razorpay_key"
RAZORPAY_API_SECRET="your_razorpay_secret"
CRON_SECRET="your_cron_secret"
```

Start the backend server
```bash
npm run dev
```
Backend will run on: http://localhost:3000

### 3. Frontend Setup
Navigate to frontend folder
```bash
cd ../frontend
```
Install dependencies
```bash
npm install
```
### Configure Environment Variables / Create `.env` File
```bash
touch .env
```
Add your credentials to .env :
```
env
VITE_BACKEND_URL="http://localhost:3000"
VITE_GOOGLE_CLIENT_ID="your_google_client_id"
VITE_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
VITE_FRONTEND_URL="http://localhost:5173"
```
Start the frontend server
```bash
npm run dev
```
Open your browser at: http://localhost:5173

Project Structure
backend/ - Contains all backend code (Node.js/Express)

frontend/ - Contains frontend React application


## 🌐 Demo

- **Frontend:** [https://rentpy.vercel.app](https://rentpy.vercel.app)  
- **Backend API:** [https://rentpy-backend.onrender.com](https://rentpy-backend.onrender.com)

## 🖼️ Screenshots

## Home Page
<img width="1890" height="890" alt="image" src="https://github.com/user-attachments/assets/2893d57b-6a20-4f6b-93f9-97857c975f37" />

## Property Listing  
<img width="705" height="843" alt="image" src="https://github.com/user-attachments/assets/818c89ab-c862-443a-b750-9d7a6d524269" />

## All Rooms 
<img width="1882" height="888" alt="image" src="https://github.com/user-attachments/assets/4e739848-30e6-451a-ac38-801412f2a5fd" />

## Booking & Payment  
<img width="1738" height="890" alt="image" src="https://github.com/user-attachments/assets/bfcf0a53-1551-4186-999c-0f4e89310181" />

## Signup 
<img width="1869" height="923" alt="image" src="https://github.com/user-attachments/assets/96843a0f-ebaa-462c-ae8a-5d21765ae08a" />

## Login
<img width="1886" height="895" alt="image" src="https://github.com/user-attachments/assets/7e6acb9d-bd53-4b40-908b-841bbfc11bda" />
