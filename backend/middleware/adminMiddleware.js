const adminOnly=(req,res,next)=>{
     try{
          if(req.user.userType!=="Admin"){
               return res.status(403).json({
                    message: "Access denied.Admin Only",
               });
          }
          next();

     }catch(error){
          res.status(500).json({
               message: error.message,
          });
     }
};
module.exports={
     adminOnly,
};