import express,{Request, Response, NextFunction}  from 'express';
import path from'path';
import fs from "fs"
import bcrypt from "bcrypt"
import {v4} from "uuid"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

let dataBaseFolder = path.join(__dirname, "../../userDatabase");
 let dataBaseFile = path.join(dataBaseFolder, "userDatabase.json")



export const addUser = async(req:Request , res:Response)=>{
//  create dynamic database
try {
    if(!fs.existsSync(dataBaseFolder)){
        fs.mkdirSync(dataBaseFolder)
    }
    if(!fs.existsSync(dataBaseFile)){
        fs.writeFileSync(dataBaseFile, "")
    } 
    
    let databaseRead:any[] =[]

    try {
   const data = fs.readFileSync(dataBaseFile, "utf-8")
      if(!data){
        res.status(401).json({
            message: "Error Reading from Database"
        })
      } else{
        databaseRead = JSON.parse(data)
      } 
    } catch (parseError) {
       databaseRead = []  
    }

    // Feedback from Frontend
   const {userName, email, password} = req.body
   let userNameExist = databaseRead.find((user:any)=>user.userName === userName)
   let userEmailExist = databaseRead.find((user:any)=>user.email === email)

     if(userNameExist){
        res.send({
            message: "Username Already Exist"
        })
     }
     if(userEmailExist){
        res.send({
            message: "Email Already Exist"
        })
     }
    //  Hasshing of Password
   const saltLength = 10;
   const salt = await bcrypt.genSalt(saltLength)
    const hash = await bcrypt.hash(password, salt)

    // Create user
    const newUsers = {
      "id": v4(),
      "userName" : userName,
      "email": email,
      "password": hash,
      "createAt": new Date(),
      "updatedAt": new Date()
    }
    databaseRead.push(newUsers)
    fs.writeFileSync(dataBaseFile, JSON.stringify(databaseRead, null, 2), "utf-8")
      return res.status(200).json({
        message: "Registration successful",
        newUsers
      })

} catch (error) {
   console.log(error) 
}

}

export const login = async(req:Request, res:Response, next:NextFunction)=>{
    let re
    try {
       //   Read from database

let readDataBase:any[] = [] 
let data = fs.readFileSync(dataBaseFile, "utf-8") 

   if(!data){
    res.status(401).json({
        message: "Error Reading from Database"
    })
   }else{
    readDataBase = JSON.parse(data)
   }

//    feedback from Frontend
const {email, password} = req.body
 const reader = readDataBase.find((user:any)=>user.email === email)
   if(!reader){
    res.send({
        message: "User does not exist"
    })
   }
   if(reader){
    const validate = await bcrypt.compare(password, reader.password)
    if(validate){
      const token = jwt.sign(reader, `${process.env.MY_SECRET}`)
      return res.status(200).json({
        message: " loggedin Succesfully",
        email : reader.email,
        token ,
       reader
    })
    }else{
       return res.send({
message: "invalid password or email"
        })
    }
  
   }

    } catch (error) {
        
    }

 
}