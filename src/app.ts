import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';  // Cache control plugin
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

// Create an executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize Apollo Server with Redis caching and cache control plugin
const server = new ApolloServer({
  schema,  // Use the schema
  cache: new RedisCache({
    client: redisClient,  // Use Redis client for caching
  }),
  plugins: [
    ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),  // Enable cache control
  ],
});

async function startServer() {
  await server.start();

  // Apply GraphQL middleware with Prisma context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ prisma }),  // Pass Prisma to resolvers
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
