import  express,{Request, Response, NextFunction} from 'express';

import jwt from "jsonwebtoken"
export const auth = (req:Request, res:Response, next:NextFunction)=>{
    try {
        const authorization = req.headers.authorization
    if(authorization === undefined){
       return  res.status(401).json({
            status: "ERROR",
            message : "Access Denied"
        })
    }
    const pin = authorization.split(" ")[1]
    
    if(!pin || pin ===""){
        return  res.status(401).json({
            status: "ACCESS DENIED",
            message : "Please provide valid details"
        })
    }
    const decryption = jwt.verify(pin, "pelzman")
    if("user" in req){
        req.user = decryption
    }
    return next();
    } catch (error) {
       console.log("error") 
    }
    
}