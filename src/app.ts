import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import prisma from './prisma';  // Prisma client
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

dotenv.config();

// Define the context type
type Context = {
  prisma: typeof prisma;
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),  // Cache control plugin
  ],
});

async function startServer() {
  const port = Number(process.env.PORT) || 5000;  // Ensure the port is a number

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 5000, host: '0.0.0.0' },  // Add host: '0.0.0.0'
    context: async () => ({
      prisma,
    }),
  });
  
  console.log(`GraphQL server is running at ${url}`);
}

startServer();
