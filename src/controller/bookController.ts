import express,{Request, Response, NextFunction}  from 'express';
import path from'path';
import fs from "fs"
import {v4} from "uuid"
import jwt, { JwtPayload } from 'jsonwebtoken';

let dataBaseFolder = path.join(__dirname, "../../bookDatabase");
 let dataBaseFile = path.join(dataBaseFolder, "bookDatabase.json")




 export const addBook = async(req:Request , res:Response)=>{
    //  create dynamic database
    try {
        if(!fs.existsSync(dataBaseFolder)){
            fs.mkdirSync(dataBaseFolder)
        }
        if(!fs.existsSync(dataBaseFile)){
            fs.writeFileSync(dataBaseFile, "")
        } 
        let allBooks:any[] =[]
    
        try {
       const data = fs.readFileSync(dataBaseFile, "utf-8")
          if(!data){
            res.status(401).json({
                message: "Error Reading from Database"
            })
          } else{
            allBooks = JSON.parse(data)
          } 
        } catch (parseError) {
           allBooks = []  
        }
    
        // Feedback from Frontend
       const{ 
        title,
        author,
        datePublished,
        description,
        pageCount,
        genre,
        bookId,
        publisher,

       } = req.body             
        let bookExist = allBooks.find((book:any)=>book.title === title)      
    
      
//    create newBook
const newBook = {
    bookId: v4(),
    title: title,
    author: author,
    datePublished: datePublished,
    description : description,
    pageCount : pageCount,
    genre : genre,    
    publisher: publisher,
    createdAt : new Date(),
    updatedAt: new Date()
}
allBooks.push(newBook)
// Write to database
fs.writeFile(dataBaseFile, JSON.stringify(allBooks, null,2), "utf-8",(err)=>{
    if(err){
        return res.status(500).json({
            message: "You  do not have access to this book"
           })  
    }else{
        return res.status(200).json({
            message: "Book Created Successfully",
            newBook
           }) 
        
    }
       
})   
    } catch (error) {
       console.log(error) 
    }
    
    }

    // GET ALLBOOKS
  export const getBooks =async(req:Request, res:Response)=>{
     let getAllBooks:[] =[]
    try {
        const data = fs.readFileSync(dataBaseFile, "utf-8")
           if(!data){
             res.status(401).json({
                 message: "Error Reading from Database"
             })
           } else{
             getAllBooks= JSON.parse(data)
           } 
           fs.writeFile(dataBaseFile, JSON.stringify(getAllBooks, null,2), "utf-8",(err)=>{
            if(err){
                return res.status(500).json({
                    message: "You  do not have access to this book"
                   })  
            }else{
                return res.status(200).json({
                    message: "Books fetched Successfully",
                    getAllBooks
                   }) 
                
            }
               
        })       
           
         } catch (parseError) {
            getAllBooks = []  
         }
  }



//   UPDATE
export const findById = async (req: JwtPayload, res: Response, next: NextFunction) => {
    try {
      let info = fs.readFileSync(dataBaseFile, 'utf8');
      if (!info) return res.send({ message: `Cannot read from database` });
      let allBooks = JSON.parse(info);
      let body = req.body;
      let id = req.params.id;
      let actualBook = allBooks.find((book: JwtPayload) => book.bookId === id);
      if (!actualBook) return res.send({ message: `Book not found` });
      console.log(body);
      let newBook = {
        bookId: actualBook.bookId,
        title: body.title || actualBook.title,
        author: body.author || actualBook.author,
        datePublished: body.datePublished || actualBook.datePublished,
        description: body.description || actualBook.description,
        pageCount: body.pageCount || actualBook.pageCount,
        genre: body.genre || actualBook.genre,
        publisher: body.publisher || actualBook.publisher,
        createdAt: actualBook.createdAt,
        updatedAt: new Date(),
      };
  
      let bookIndex = allBooks.findIndex((book: JwtPayload) => book.bookId === id);
      allBooks[bookIndex] = newBook;
  
      fs.writeFileSync(dataBaseFile, JSON.stringify(allBooks, null, 2), 'utf-8');
      return res.status(200).json({
        status: `Success`,
        
        book: newBook,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: `Error updating` });
    }
  };

//  DELETE

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    let allBooks: any[] = [];

    try {
        const infos2 = fs.readFileSync(dataBaseFile, "utf-8");

        if (!infos2) {
            return res.status(400).json({
                message: `This book cannot be accessed`,
            });
        } else {
            allBooks = JSON.parse(infos2);        

        const {
            title,
            author,
            datePublished,
            description,
            pageCount,
            genre,
            bookId,
            publisher,
        } = req.body;

        let getBooks = allBooks.findIndex((a) => a.title === req.body.title);
        allBooks[getBooks] = req.body;

        let delBooks = allBooks.findIndex((a) => a.title === req.body.title) //check if you can add Index to addAllData
        allBooks.splice(delBooks, 1)

        fs.writeFile(dataBaseFile, JSON.stringify(allBooks, null, 2), "utf-8", (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Failed to DEETE the book`,
                });
            } else {
                return res.status(200).json({
                book: allBooks
                });
            }
        })}
    } catch (err) {
        return res.status(500).json({
            message: `Failed to DELETE the book`,
        });
    }
};


