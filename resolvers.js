const { AuthenticationError, PubSub } = require('apollo-server');
// const mongoose = require('mongoose');
const Pin = require('./models/Pin');

const pubSub = new PubSub();

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
      await pubSub.publish('PIN_ADDED', { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (parent, { pinId }) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: pinId }).exec();
      await pubSub.publish('PIN_DELETED', { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(
      async (parent, { pinId, text }, { currentUser }, info) => {
        const updatePin = await Pin.findOneAndUpdate(
          { _id: pinId },
          { $push: { comments: { text, author: currentUser._id } } },
          { new: true },
        )
          .populate('author')
          .populate('comments.author');
        // await pubSub.publish('PIN_UPDATED', { updatePin });
        return updatePin;
      },
    ),
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubSub.asyncIterator('PIN_ADDED'),
    },
    pinDeleted: {
      subscribe: () => pubSub.asyncIterator('PIN_DELETED'),
    },
    pinUpdated: {
      subscribe: () => pubSub.asyncIterator('PIN_UPDATED'),
    },
  },
};
