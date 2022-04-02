const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const typeDefs = require('./schema/schema');
const resolvers = require('./resolver/resolver');

(async function () {
    const app = express();
    const httpServer = createServer(app);
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: '/graphql' }
    );
    const server = new ApolloServer({
        schema,
        plugins: [
            {
                async serverWillStart() {
                    return
                    {
                        drainServer()
                        {
                            subscriptionServer.close();
                        }
                    };
                }
            }
        ],
    });
    await server.start();
    server.applyMiddleware({ app });
    httpServer.listen(3000 , () =>
        console.log(`Server ready at http://localhost:3000}`)
    );
})();



// server.start().then(res => {
//     server.applyMiddleware({ app });
//     app.listen({ port: 3000 }, () =>
//         console.log(`Server ready at http://localhost:3000${server.graphqlPath}`)
//     )
// })