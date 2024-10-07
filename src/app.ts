import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import authRoutes from './routes/auth';  
import productRoutes from './routes/product';  
import orderRoutes from './routes/order';  
import vendorRoutes from './routes/vendor';  
import productCategoryRoutes from './routes/productCategory';  
import userRoutes from './routes/user';
import unitOfMeasureRoutes from './routes/unitOfMeasure';
import addressRoutes from './routes/address';
import chatRoutes from './routes/chat';
import paymentRoutes from './routes/payment';
import { RedisCache } from 'apollo-server-cache-redis';
import redisClient from './redis/redisClient';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new RedisCache({
    client: redisClient,  // Use the Redis client for caching
  }),
});

async function startServer() {
  await server.start();

  // Apply GraphQL middleware with Prisma context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ prisma }),  // This is where Prisma is added as context
    })
  );

  // REST endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/vendors', vendorRoutes);
  app.use('/api/product-categories', productCategoryRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/units', unitOfMeasureRoutes);
  app.use('/api/addresses', addressRoutes);
  app.use('/api/chats', chatRoutes);
  app.use('/api/payments', paymentRoutes);
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  });
}

startServer();
