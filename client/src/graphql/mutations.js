export const CREATE_PIN = `
  mutation(
  $title: String!
  $image: String!
  $content: String!
  $latitude: Float!
  $longitude: Float!
) {
  createPin(
    input: {
      title: $title
      image: $image
      content: $content
      latitude: $latitude
      longitude: $longitude
    }
  ) {
    _id
    createdAt
    title
    content
    image
    latitude
    longitude
    author {
      _id
      name
      email
      picture
    }
  }
}

`;

export const DELETE_PIN = `
mutation($pinId: ID!) {
  deletePin(pinId: $pinId) {
    _id
  }
};
`;

export const CREATE_COMMENT = `
mutation($pinId: ID!, $text: String!) {
  createComment(pinId: $pinId, text: $text) {
    _id
    createdAt
    title
    content
    image
    latitude
    longitude
    author {
      _id
      name
    }
    comments {
      text
      createdAt
      author {
        name
        picture
      }
    }
  }
}
`;
