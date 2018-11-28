import { Prisma } from '../generated/prisma-client/index';

export const getUser = async (req, res, next, db: Prisma) => {
  if (!req.token || !req.token.sub) {
    // anonymous user
    return next();
  }
  req.user = await db.user({
    auth0Id: req.token.sub 
  });
  
  if (!req.user) {
    // user does not exist
    console.error(`User ${req.token.sub} does not exist`);
    req.user = '404';
  }
  next();
};
