import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

    // If not, create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.json({ token, user: newUser });
  } catch (error) {
    // Log the full error stack for debugging
    console.error("Registration Error Stack:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
      }
    }

    // Send a generic error message to the client
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
    res.json({ token, user });
  } catch (error) {
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
