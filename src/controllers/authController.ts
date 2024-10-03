import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'Email is already registered' });
        return;
      }
  
      // Create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
  
      // Generate the token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  
      // Exclude password from the user object
      const { password: _, ...userWithoutPassword } = newUser;
  
      // Send response without password
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ error: 'User registration failed' });
    }
  };
  
// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  
      // Omit password from the user object
      const { password: _, ...userWithoutPassword } = user;
  
      // Send response without the password
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: 'Login failed' });
    }
  };
  
// OAuth for Google
export const googleAuth = (req: Request, res: Response) => {
  // Handle Google OAuth login
};

// OAuth for Facebook
export const facebookAuth = (req: Request, res: Response) => {
  // Handle Facebook OAuth login
};
