import express from 'express'
import router from './routes/auth';
const app=express();
const cors=require('cors');

app.use(express.json());
app.use(cors());
app.use("/auth", router);

app.listen(3000,() =>{
    console.log('Server running on http://localhost:3000');
});
