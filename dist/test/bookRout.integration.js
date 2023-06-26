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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const books_1 = __importDefault(require("../routes/books"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/books", books_1.default);
describe('integration test for book API', () => __awaiter(void 0, void 0, void 0, function* () {
    it('GET /getBook - success- get all user', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app).get('/books/getBook');
        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                author: expect.any(String),
                datePublished: expect.any(Number),
                description: expect.any(String),
                pageCount: expect.any(Number),
                genre: expect.any(String),
                bookId: expect.any(String),
                publisher: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            })
        ]));
    }));
    it('POST /books failure on invalid post body', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = ((yield (0, supertest_1.default)(app).post('/books').send({
            title: '',
            author: "John "
        })));
    }));
}));
