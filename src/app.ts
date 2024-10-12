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

// Create Apollo Server instance
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),  // Cache control plugin
    {
      async requestDidStart() {
        console.log('GraphQL Request Started');

        return {
          async willSendResponse(requestContext) {
            console.log('GraphQL Response:', requestContext.response);
          },
        };
      },
    },
  ],
  formatError: (error) => {
    // Log detailed errors on the server side
    console.error('[GraphQL Error]:', {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: error.extensions,
    });
    return error;  // Ensure the error is still returned to the client
  },
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
