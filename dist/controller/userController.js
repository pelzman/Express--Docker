"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.addUser = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let dataBaseFolder = path_1.default.join(__dirname, "../../userDatabase");
let dataBaseFile = path_1.default.join(dataBaseFolder, "userDatabase.json");
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  create dynamic database
    try {
        if (!fs_1.default.existsSync(dataBaseFolder)) {
            fs_1.default.mkdirSync(dataBaseFolder);
        }
        if (!fs_1.default.existsSync(dataBaseFile)) {
            fs_1.default.writeFileSync(dataBaseFile, "");
        }
        let databaseRead = [];
        try {
            const data = fs_1.default.readFileSync(dataBaseFile, "utf-8");
            if (!data) {
                res.status(401).json({
                    message: "Error Reading from Database"
                });
            }
            else {
                databaseRead = JSON.parse(data);
            }
        }
        catch (parseError) {
            databaseRead = [];
        }
        // Feedback from Frontend
        const { userName, email, password } = req.body;
        let userNameExist = databaseRead.find((user) => user.userName === userName);
        let userEmailExist = databaseRead.find((user) => user.email === email);
        if (userNameExist) {
            res.send({
                message: "Username Already Exist"
            });
        }
        if (userEmailExist) {
            res.send({
                message: "Email Already Exist"
            });
        }
        //  Hasshing of Password
        const saltLength = 10;
        const salt = yield bcrypt_1.default.genSalt(saltLength);
        const hash = yield bcrypt_1.default.hash(password, salt);
        // Create user
        const newUsers = {
            "id": (0, uuid_1.v4)(),
            "userName": userName,
            "email": email,
            "password": hash,
            "createAt": new Date(),
            "updatedAt": new Date()
        };
        databaseRead.push(newUsers);
        fs_1.default.writeFileSync(dataBaseFile, JSON.stringify(databaseRead, null, 2), "utf-8");
        return res.status(200).json({
            message: "Registration successful",
            newUsers
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.addUser = addUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let re;
    try {
        //   Read from database
        let readDataBase = [];
        let data = fs_1.default.readFileSync(dataBaseFile, "utf-8");
        if (!data) {
            res.status(401).json({
                message: "Error Reading from Database"
            });
        }
        else {
            readDataBase = JSON.parse(data);
        }
        //    feedback from Frontend
        const { email, password } = req.body;
        const reader = readDataBase.find((user) => user.email === email);
        if (!reader) {
            res.send({
                message: "User does not exist"
            });
        }
        if (reader) {
            const validate = yield bcrypt_1.default.compare(password, reader.password);
            if (validate) {
                const token = jsonwebtoken_1.default.sign(reader, `${process.env.MY_SECRET}`);
                return res.status(200).json({
                    message: " loggedin Succesfully",
                    email: reader.email,
                    token,
                    reader
                });
            }
            else {
                return res.send({
                    message: "invalid password or email"
                });
            }
        }
    }
    catch (error) {
    }
});
exports.login = login;
