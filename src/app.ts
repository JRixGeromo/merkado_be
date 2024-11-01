import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import prisma from './prisma'; // Prisma client
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
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [
    ApolloServerPluginCacheControl({ defaultMaxAge: 5 }), // Cache control plugin
    // Request/Response Logging Plugin
    {
      async requestDidStart() {
        console.log('GraphQL Request Started');

        return {
          async willSendResponse(requestContext) {
            // Ensure the response has a status code
            const status = requestContext.response.http?.status || 'undefined';
            console.log(
              `GraphQL Response: { status: ${status}, body: ${JSON.stringify(requestContext.response.body)} }`
            );
          },
        };
      },
    },
  ],

  // Error formatting for server-side logs
  formatError: (error) => {
    // Log detailed errors on the server side
    console.error('[GraphQL Error]:', {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: error.extensions,
    });
    return error; // Ensure the error is still returned to the client
  },
});

async function startServer() {
  // Ensure port is correctly parsed from .env or fallback to 5000
  const port = Number(process.env.PORT) || 5000;

  const { url } = await startStandaloneServer(server, {
    listen: { port: port, host: '0.0.0.0' }, // Ensure server is available on 0.0.0.0
    context: async () => ({
      prisma, // Attach Prisma to context for each request
    }),
  });

  console.log(`GraphQL server is running at ${url}`);
}

// Start the server
startServer();
