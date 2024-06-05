import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());





// // Mock user database
// const users: { username: string; password: string }[] = [];

// // Middleware for authentication
// const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     // For simplicity, we'll use basic auth (username:password)
//     const base64Credentials = authHeader.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     const [username, password] = credentials.split(':');

//     const user = users.find((u) => u.username === username && u.password === password);
//     if (user) {
//       req.user = user;
//       return next();
//     }
//   }
//   res.status(401).send('Unauthorized');
// };

// // Routes

// // Register route
// app.post('/register', (req, res) => {
//   const { username, password } = req.body;
//   if (username && password) {
//     users.push({ username, password });
//     res.status(201).send('User registered');
//   } else {
//     res.status(400).send('Bad request');
//   }
// });

// // Login route
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((u) => u.username === username && u.password === password);
//   if (user) {
//     res.send('Login successful');
//   } else {
//     res.status(401).send('Invalid credentials');
//   }
// });

// // Protected route
// app.get('/protected', auth, (req, res) => {
//   res.send('This is a protected route');
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
