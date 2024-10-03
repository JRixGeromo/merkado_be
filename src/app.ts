
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// import express, { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const app = express();
// const prisma = new PrismaClient();

// app.use(express.json());

// // Root route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello TypeScript World!');
// });

// // Route to get all users
// app.get('/users', async (req: Request, res: Response) => {
//   try {
//     const users = await prisma.user.findMany(); // Fetch all users from the database
//     res.json(users); // Send the users as a JSON response
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while fetching users' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
