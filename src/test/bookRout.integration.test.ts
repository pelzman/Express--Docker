import express from "express"
import request from"supertest"
import bookRoute from "../routes/books"


const app = express()
app.use(express.json())

app.use("/books", bookRoute);

  describe('integration test for book API', ()=>{
    test('GET /getBook - success- get all user', async()=>{
const {body , statusCode} = await request(app).get('/books/getBook')
expect(body).toEqual(expect.objectContaining({
     message:expect.any(String),
    getAllBooks : expect.arrayContaining([
        expect.objectContaining({
            author: expect.any(String),
            datePublished: expect.any(String),
            description: expect.any(String),
            pageCount: expect.any(Number),
            genre: expect.any(String),
            bookId : expect.any(String),
            publisher: expect.any(String),
            createdAt : expect.any(String),
            updatedAt: expect.any(String)
            })
    ])
   
    }))
    })

    // it('POST /books failure on invalid post body', async ()=>{
    //     const {body, statusCode} = ((await request(app).post('/books').send({
    //         title:'',
    //         author : "John " 
    //     })))
    // })
  })



