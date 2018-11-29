import { GraphQLServer } from 'graphql-yoga';
import bearerToken from 'express-bearer-token';
import { prisma } from './generated/prisma-client'
import { getUser } from './middleware';
import resolvers from './resolvers';
import { directiveResolvers } from './directive-resolvers';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  directiveResolvers,
  context: req => ({
    ...req,
    db: prisma
  }),
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

server.express.use(bearerToken());

server.express.post(server.options.endpoint, (req, res, next) =>
  getUser(req, res, next, prisma)
);

server.start(() => console.log('Server is running on http://localhost:4000'))
  .catch((err) => console.error('Error starting server: ' + err));
