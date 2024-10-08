import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';  // Correct plugin import
import express from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import http from 'http';

dotenv.config();

const app = express();
app.use(express.json());

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),  // Cache control plugin
  ],
});

async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ prisma }),  // Pass Prisma to resolvers
    })
  );

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  });
}

startServer();
