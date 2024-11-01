"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const cacheControl_1 = require("@apollo/server/plugin/cacheControl");
const standalone_1 = require("@apollo/server/standalone");
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./prisma")); // Prisma client
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
dotenv_1.default.config();
// Create Apollo Server instance
const server = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
        (0, cacheControl_1.ApolloServerPluginCacheControl)({ defaultMaxAge: 5 }), // Cache control plugin
        // Request/Response Logging Plugin
        {
            requestDidStart() {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('GraphQL Request Started');
                    return {
                        willSendResponse(requestContext) {
                            return __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                // Ensure the response has a status code
                                const status = ((_a = requestContext.response.http) === null || _a === void 0 ? void 0 : _a.status) || 'undefined';
                                console.log(`GraphQL Response: { status: ${status}, body: ${JSON.stringify(requestContext.response.body)} }`);
                            });
                        },
                    };
                });
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
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure port is correctly parsed from .env or fallback to 5000
        const port = Number(process.env.PORT) || 5000;
        const { url } = yield (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: port, host: '0.0.0.0' }, // Ensure server is available on 0.0.0.0
            context: () => __awaiter(this, void 0, void 0, function* () {
                return ({
                    prisma: prisma_1.default, // Attach Prisma to context for each request
                });
            }),
        });
        console.log(`GraphQL server is running at ${url}`);
    });
}
// Start the server
startServer();
