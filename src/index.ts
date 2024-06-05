import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import jwt, { JwtPayload }from "jsonwebtoken"
import dotenv from "dotenv"
import {Request, Response, NextFunction} from "express"
dotenv.config()



const app = express()
const PORT =  3002  

const prisma = new PrismaClient()

//Custom middleware 
app.use(bodyParser.json())
app.use(cors())

// Route handlers

app.post('/register', async (req: Request, res: Response) => {

    const {email, password} = req.body;

    //Kryptera lösenordet
    const saltRounds = 10 // ju högre tal desto svårare att dekryptera, men kräver mer beräkningskraft för att kryptera
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        // Finns användaren redan i databasen?
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(existingUser) {
            return res.status(400).json({message: "User already exist"})
        }

        // Ingen dublett, spara användare i databasen
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })

        return res.status(200).json({message: `User with id ${user.id} created`})

    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }
})

app.post("/login", async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {
        // Finns användaren i databasen?
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })


        if(!user) {
            return res.status(400).send("User does not exist. Please rgister")
        }

        // Är lösenordet som användaren har skrivit in densamma som har hittats på användaren i databasen
        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword) {
            return res.status(400).send("Password do not match!")
        }

        if(!process.env.JWT_SECRET) {
            return res.status(500).json({error: "internal server error"})
        }

        // Användaren är betrodd. email finns i db och matchar lösenordet
        // Skapa vårt token med vårt hemliga ord (JWT_SECRET)
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        res.status(200).json({message: `Token created ${token}`})


    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }

})


interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
  }

// Middleware för att verifiera att användaren är betrodd
const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1]

    if(!token) {
        return res.status(401).send("Acess denied")
    }

    if(!process.env.JWT_SECRET) {
        return res.status(500).json({error: "internal server error"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload
        req.user = decoded;
        next()

    } catch(error) {
        console.error(error);
        res.status(400).send("Invalid token")
    }


}


// En protected route
app.get("/protected", auth ,(req, res) => {
    res.send("The user it authenticated and can access this route")
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})