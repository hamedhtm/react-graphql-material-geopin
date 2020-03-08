const mongoose = require('mongoose');
const User = mongoose.model('User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  // verify token
  const googleUser = await verifyAuthToken(token);
  // if user exist return user otherwise create user
  const user = await checkIfUserExist(googleUser.email);
  return user ? user : await createNewUser(googleUser);
};

const verifyAuthToken = async token => {
  try {
    const ticket = client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    return await ticket.getPayload();
  } catch (e) {
    console.error('Error verifying auth token', e);
  }
};

const checkIfUserExist = async email => {
  await User.findOne({ email }).exec();
};

const createNewUser = async ({ name, email, picture }) => {
  return await new User({
    name,
    email,
    picture,
  }).save();
};
