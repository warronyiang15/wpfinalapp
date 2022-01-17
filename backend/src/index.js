import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db'
import Query from './Resolvers/Query'
import Mutation from './Resolvers/Mutation';
import Subscription from './Resolvers/Subscription';
import { fetch } from './Utility/credentials';

const pubsub = new PubSub()
pubsub.ee.setMaxListeners(30);

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
  },
  context: {
    db,
    pubsub,
  },
});


db.once('open', async () => {
    server.start({ port: process.env.PORT | 4000 }, async () => {
  
        console.log(`The server is up on port ${process.env.PORT | 4000}!`);
    });
})