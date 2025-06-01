
import jwt from 'jsonwebtoken';
export const isAuth=(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({message:"Unauthorized, please login"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.userId;
        req.userRole=decoded.userRole;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"});
        
    }
}


export const isAdmin=async(req,res,next)=>{
    try {
        if(req.userRole!=="admin"){
            return res.status(403).json({message:"Forbidden, you are not an admin"});
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"});
        
    }
}