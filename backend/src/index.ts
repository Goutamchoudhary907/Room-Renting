import express from 'express'
import router from './routes/auth';
import router2 from './routes/ForgotPassword';

const app=express();
const cors=require('cors');

app.use(express.json());
app.use(cors());
app.use("/auth", router);
app.use("", router2)

app.listen(3000,() =>{
    console.log('Server running on http://localhost:3000');
});
