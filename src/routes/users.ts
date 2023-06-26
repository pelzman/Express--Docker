import  express,{Request, Response, NextFunction} from 'express';
import {addUser} from "../controller/userController"
import {login} from "../controller/userController"
const router = express.Router();


/* GET users listing. */
// router.get('/', function(req:Request, res:Response, next:NextFunction) {
//   res.send('respond with a resource');
// });
router.post('/signup', addUser)
router.post('/login', login)

export default router;
