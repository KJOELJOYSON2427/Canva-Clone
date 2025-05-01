
const express = require("express");

const multer =require("multer");

const {uploadMedia, getAllMediaByUser} = require("../controller/upload-controller")
const authenticatedRequest =require("../src/middleware/auth-middleware")
const router = express.Router();
const {generateImageFromAIAndUpload} =require("../controller/ai-contrroller")
const upload = multer({
    storage :multer.memoryStorage(),
    limits:10 * 1024 * 1024 * 1024

}).single("file") //acceptfile



router.post("/upload",authenticatedRequest, 

    (req, res,next)=>{
         upload(req,res, function(err){
            if(err instanceof multer.MulterError){
                return res.status(400).json({
                    success:false,
                    message:err.message
                })
            }else if(err){
                return res.status(500).json({
                    success:false,
                    message:err.message
                })
            }
            if(!req.file){
                return res.status(400).json({
                    success:false,
                    message:"No File Found!"
                })
            }


            console.log(req.file);
            next(); 
            
        
         })
    },
    uploadMedia
);

router.get("/get",authenticatedRequest, getAllMediaByUser);


router.post("/ai-image-generate",authenticatedRequest, generateImageFromAIAndUpload);
module.exports =router;