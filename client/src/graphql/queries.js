export const ME_QUERY = `
  {
  me {
    _id
    name
    email
    picture
  }
}
`;

export const GET_PINS = `
  {
  getPins {
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
    comment {
      text
      createdAt
      author {
        _id
        name
        email
        picture
      }
    }
  }
}

`;
