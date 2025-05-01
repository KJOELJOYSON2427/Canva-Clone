require('dotenv').config();

const express = require("express");
const mongoose=require('mongoose');

const cors=require('cors');
const helmet= require('helmet');

const app = express();

const PORT=  process.env.PORT || 5003
const SubscriptionRoutes= require("../routes/subscription-routes")

mongoose
        .connect(process.env.MONGO_URI)
        .then(()=>console.log("connected to Mangodb successfully"))
        .catch(()=> console.log("MangoDB Error", error))

        app.use(cors());
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({
            extended:true
        }));
        app.use("/api/subscription", SubscriptionRoutes);


 async function startServer(params) {
     try{
      app.listen(PORT, ()=> console.log(`Subscription Service is running on port ${PORT}`));
      
     }catch(e){
     console.error('Failed to connect to server',error);
     process.exit(1);
     } 
 }
 startServer()