const { AuthenticationError } = require('apollo-server');
// const mongoose = require('mongoose');
const Pin = require('./models/Pin');

const authenticated = next => (parent, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  }
  return next(parent, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((parent, args, ctx, info) => ctx.currentUser),
  },
  Mutation: {
    createPin: authenticated(async (parent, args, ctx, info) => {
      console.log(args);

      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      return Pin.populate(newPin, 'author');
    }),
  },
};
