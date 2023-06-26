"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (authorization === undefined) {
            return res.status(401).json({
                status: "ERROR",
                message: "Access Denied"
            });
        }
        const pin = authorization.split(" ")[1];
        if (!pin || pin === "") {
            return res.status(401).json({
                status: "ACCESS DENIED",
                message: "Please provide valid details"
            });
        }
        const decryption = jsonwebtoken_1.default.verify(pin, "pelzman");
        if ("user" in req) {
            req.user = decryption;
        }
        return next();
    }
    catch (error) {
        console.log("error");
    }
};
exports.auth = auth;
