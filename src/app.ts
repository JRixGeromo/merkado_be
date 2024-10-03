import express, { Request, Response } from 'express';

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Example route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript World!');
});

// Set up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
