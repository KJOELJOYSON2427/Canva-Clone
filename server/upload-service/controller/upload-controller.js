const {uploadMediaToCloudinary}=require("../../upload-service/utils/cloudinary");
const Media=require("../models/media");


const uploadMedia = async(req, res)=>{ //req.file is from multer 
  try{
    console.log("comindddddd");
      if(!req.file){
        return res.status(400).json({
            success:false,
            message:"No File Found!"
        })
      }
      const {originalname, mimetype, size, width, height}=req.file;
      const {userId} =req.user;

      const cloudinaryResult = await uploadMediaToCloudinary(req.file)

      const newlyCreatedMedia = new Media({
        userId,
        name:originalname,
        cloudinaryId:cloudinaryResult.public_id,
         url:cloudinaryResult.secure_url,
        mimetype:mimetype,
        size:size,
        height:height,
        width:width
    })
    console.log("lohidn d");

    await newlyCreatedMedia.save();
     return res.status(200).json({
        success:true,
        data:newlyCreatedMedia
    })
  }catch(e){
    return res.status(500).json({
        success:false,
        message:"Error Creating assest"
    })
  }
}




const getAllMediaByUser = async (req, res) => {
    try {
      console.log("Fetching user media...");
  
      const media = await Media.find({
        userId: req.user.userId,
      }).sort({
        createdAt: -1,
      });
  
      return res.status(200).json({
        success: true,
        data: media,
      });
  
      // NOTE: Any code after return won't be executed
      // console.log(media); ← will never run here
  
    } catch (e) {
      console.error("Error fetching media:", e.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching media assets",
      });
    }
  };
  
module.exports ={uploadMedia, getAllMediaByUser}

