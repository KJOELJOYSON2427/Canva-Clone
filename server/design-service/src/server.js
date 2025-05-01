require('dotenv').config();

const express = require("express");
const mongoose=require('mongoose');

const cors=require('cors');
const helmet= require('helmet');
const designRoutes  = require("../routes/design-routes")
const app = express();

const PORT=  process.env.PORT || 5001

mongoose
        .connect(process.env.MONGO_URI)
        .then(()=>console.log("connected to Mangodb successfully"))
        .catch(()=> console.log("MangoDB Error", error))

        app.use(cors());
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({
            extended:true
        }))
        app.use("/api/designs", designRoutes);

        

 async function startServer(params) {
     try{
      app.listen(PORT, ()=> console.log(`Design Service is running on port ${PORT}`));
      
     }catch(e){
     console.error('Failed to connect to server',error);
     process.exit(1);
     } 
 }
 startServer()