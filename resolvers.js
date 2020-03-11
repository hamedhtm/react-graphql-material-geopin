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
    getPins: async (parent, args, ctx, info) => {
      return await Pin.find({})
        .populate('author')
        .populate('comments.author');
    },
  },
  Mutation: {
    createPin: authenticated(async (parent, args, ctx, info) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const pinAdded = await Pin.populate(newPin, 'author');
      return pinAdded;
    }),
    deletePin: authenticated(async (parent, { pinId }) => {
      return await Pin.findOneAndDelete({ _id: pinId }).exec();
    }),
  },
};
