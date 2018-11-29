import { Prisma } from '../generated/prisma-client/index';
import app from '../firebaseAdmin';

export const getUser = async (req, res, next, db: Prisma) => {
  if (!req.token) {
    // anonymous user
    return next();
  }

  const decodedToken = await app.auth().verifyIdToken(req.token);

  req.user = await db.user({
    firebaseId: decodedToken.uid 
  });
  
  if (!req.user) {
    // user does not exist
    console.error(`User ${req.token.sub} does not exist`);
    req.user = '404';
  }

  next();
};
