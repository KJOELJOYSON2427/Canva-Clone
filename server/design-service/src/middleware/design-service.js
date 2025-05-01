const authenticatedRequest = (req, res, next)=>{
    const userId= req.headers["x-user-id"];
    if(!userId){
        return  res.status(500).json({
            message: "Internal server error!",
            error: err.message
        });
    }

    req.user ={
        userId
    }
    next();

}

module.exports = authenticatedRequest;