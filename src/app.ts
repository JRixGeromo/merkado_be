import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import authRoutes from './routes/auth';  // Import your auth routes
import productRoutes from './routes/product';  // Import product routes
import orderRoutes from './routes/order';  // Import order routes
import vendorRoutes from './routes/vendor';  // Import vendor routes
import productCategoryRoutes from './routes/productCategory';  // Import product category routes

dotenv.config();

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  // Apply GraphQL middleware with context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ prisma }),
    })
  );

  // REST endpoints
  app.use('/api/auth', authRoutes);  // Add your REST auth routes
  app.use('/api/products', productRoutes);  // Add product routes
  app.use('/api/orders', orderRoutes);  // Add order routes
  app.use('/api/vendors', vendorRoutes);  // Add vendor routes
  app.use('/api/product-categories', productCategoryRoutes);  // Add product category routes

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  });
}

startServer();
