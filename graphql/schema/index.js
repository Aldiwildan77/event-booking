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

type Booking {
  _id: ID!
  event: Event!
  user: User!
  createdAt: String!
  updatedAt: String!
}

type AuthData { 
  userId: ID!
  token: String!
  tokenExp: Int!
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
  bookings: [Booking!]!
  login(username: String!, password: String!): AuthData!
} 

type RootMutation {
  createEvent(EventInput: EventInput): Event
  createUser(UserInput: UserInput): User
  bookEvent(eventId: ID!): Booking!
  cancelBooking(bookingID: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation 
  }
`)