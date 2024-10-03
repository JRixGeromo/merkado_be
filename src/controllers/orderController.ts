import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  const { userId, products, totalAmount } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        customer: { connect: { id: userId } },
        products: {
          connect: products.map((productId: number) => ({ id: productId })),
        },
        totalAmount,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Order creation failed' });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { products: true },
    });
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: 'Order not found' });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Order update failed' });
  }
};
