import  express,{Request, Response, NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {addBook} from "../controller/bookController"
import {getBooks} from "../controller/bookController"
import {auth} from "../utilities/auth"
import { findById,deleteBook} from "../controller/bookController"
// import {deleteBook} from "../controller/bookController"
const router = express.Router();


/* GET users listing. */
// router.get('/', function(req:Request, res:Response, next:NextFunction) {
//   res.send('respond with a resource');
// });
router.post('/add',auth, addBook)
router.get("/getBook", getBooks)
// router.put('/updatebyid/:id', findById)
router.put('/:id',auth, findById)
router.delete('/:title',auth, deleteBook)


export default router;
