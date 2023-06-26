"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controller/bookController");
const bookController_2 = require("../controller/bookController");
const auth_1 = require("../utilities/auth");
const bookController_3 = require("../controller/bookController");
// import {deleteBook} from "../controller/bookController"
const router = express_1.default.Router();
/* GET users listing. */
// router.get('/', function(req:Request, res:Response, next:NextFunction) {
//   res.send('respond with a resource');
// });
router.post('/add', auth_1.auth, bookController_1.addBook);
router.get("/getBook", bookController_2.getBooks);
// router.put('/updatebyid/:id', findById)
router.put('/:id', auth_1.auth, bookController_3.findById);
router.delete('/:title', auth_1.auth, bookController_3.deleteBook);
exports.default = router;
