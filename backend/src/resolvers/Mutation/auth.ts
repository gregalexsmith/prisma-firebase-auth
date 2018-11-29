import { Context } from '../../context';
import app from '../../firebaseAdmin';
import { auth as authTypes } from 'firebase-admin';

export const auth = {

  async signUp(parent, { idToken }, ctx: Context, info) {
    let token : authTypes.DecodedIdToken = null;
    try {
      token = await app.auth().verifyIdToken(idToken);
    } catch (err) {
      throw new Error(err.message);
    }
    const firebaseId = token.uid;
    const user = await ctx.db.user({ 
      firebaseId
    });
    
    if (user) {
      // Just in case this user is logging in just after verifying their email:
      if (user.emailVerified !== token.email_verified) {
        return ctx.db.updateUser({ where: { firebaseId }, data: { emailVerified: token.email_verified } });
      }
      return user;
    }
    return ctx.db.createUser({
        email: token.email,
        emailVerified: token.email_verified,
        firebaseId: token.uid,
        name: token.name,
        avatar: token.picture
    });
  },

  async verifyEmail(parent, { idToken }, ctx: Context, info) {
    let token : authTypes.DecodedIdToken = null;
    try {
      token = await app.auth().verifyIdToken(idToken);
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
    if (ctx.request.user.firebaseId !== token.uid) {
      console.error(`Request user identity (${ctx.request.user.firebaseId}) does not match ID Token uid (${token.uid})`);
      throw new Error('Error matching user identity.');
    }
    return ctx.db.updateUser({
      data: { emailVerified: token.email_verified },
      where: { firebaseId: token.uid }
    });
  },

  async deleteMe(parent, args, ctx: Context, info) {
    return ctx.db.deleteUser({ id: ctx.request.user.id });
  }
};
