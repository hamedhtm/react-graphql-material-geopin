const { AuthenticationError } = require('apollo-server');

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
};
