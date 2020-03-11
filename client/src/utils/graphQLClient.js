import { GraphQLClient } from 'graphql-request';

export const graphQLClient = idToken => {
  return new GraphQLClient('http://localhost:4000/graphql', {
    headers: {
      authorization: idToken
        ? idToken
        : window['gapi']['auth2']
            .getAuthInstance()
            .currentUser.get()
            .getAuthResponse().id_token,
    },
  });
};
