import { clerkClient, getAuth } from "@clerk/express";

export const protectEducator = async (req,res,next)=>{
 try{
   const { userId } = getAuth(req);

   console.log("User:", userId);

   const user = await clerkClient.users.getUser(userId);

   console.log("Metadata:", user.publicMetadata);

   if(user.publicMetadata.role !== "educator"){
      return res.status(403).json({
         success:false,
         message:"Unauthorized Access"
      });
   }

   next();

 }catch(error){
   console.log(error);
   res.status(500).json({
      success:false,
      message:error.message
   });
 }
}