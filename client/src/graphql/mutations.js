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
