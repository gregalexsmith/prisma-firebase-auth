import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './generated/prisma-client'
import { checkJwt, getUser } from './middleware';
import resolvers from './resolvers';
import { directiveResolvers } from './directive-resolvers';
import * as firebase from 'firebase-admin';

// const firebaseConfig = require('./secrets/firebase-admin-config.json')

// firebase.initializeApp({
//   credential: firebase.credential.cert(firebaseConfig),
//   databaseURL: "https://habit-app-f89b8.firebaseio.com"
// });



// export function initApp(serviceAcct: any, name: string) {
//     return firebase.initializeApp({
//         credential: firebase.credential.cert(serviceAcct),
//         databaseURL: 'https://mock.firebaseio.com'
//     }, name);
// }

// export function addValueEventListener(
//     // Check for type compilation
//     db: firebase.database.Database,
//     callback: (s: firebase.database.DataSnapshot) => any) {
//     let eventType: firebase.database.EventType = 'value';
//     db.ref().on(eventType, callback);
// }



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

server.express.post(server.options.endpoint, checkJwt, (err, req, res, next) => {
    if (err) {
      console.error('Token error: ' + err);
      return res.status(401).send(err.message);
    }
    next();
  }
);

server.express.post(server.options.endpoint, (req, res, next) =>
  getUser(req, res, next, prisma)
);

server.start(() => console.log('Server is running on http://localhost:4000'))
  .catch((err) => console.error('Error starting server: ' + err));
