import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new payment
export const createPayment = async (req: Request, res: Response) => {
  const { method, amount, transactionId, orderId } = req.body;
  try {
    const payment = await prisma.payment.create({
      data: {
        method,
        amount,
        transactionId,
        order: { connect: { id: orderId } },
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Get payment details by order ID
export const getPaymentByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const payment = await prisma.payment.findUnique({
      where: { orderId: parseInt(orderId) },
    });
    res.json(payment);
  } catch (error) {
    res.status(404).json({ error: 'Payment not found' });
  }
};
