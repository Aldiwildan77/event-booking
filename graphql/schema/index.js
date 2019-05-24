const { buildSchema } = require('graphql')

module.exports = buildSchema(`
type Event {
  _id: ID!
  judul: String!
  deskripsi: String!
  harga: Float!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  nama: String!
  username: String!
  email: String!
  password: String
  createdEvents: [Event!]
}

input EventInput {
  judul: String!
  deskripsi: String!
  harga: Float!
  date: String!
}

input UserInput {
  nama: String!
  username: String!
  email: String!
  password: String!
}

type RootQuery {
  events: [Event!]!
  users: [User!]!
} 

type RootMutation {
  createEvent(EventInput: EventInput): Event
  createUser(UserInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation 
  }
`)