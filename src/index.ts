import express from "express"
import bodyParser from "body-parser"
import cors from "cors"



const app = express()
const PORT = process.env.PORT || 3000  

//Middleware s
app.use(bodyParser.json())
app.use(cors())



app.listen(() => {
    console.log(`Server is running on port ${PORT}`)
})