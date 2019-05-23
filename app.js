const express = require('express')
const morgan = require('morgan')
const graphqlHTTP = require('express-graphql')
const bcrypt = require('bcrypt')
const {
  buildSchema
} = require('graphql')

const app = express()
const events = []

// Mongodb
require('./db/connection')

// Database
const Event = require('./models/event')
const User = require('./models/user')

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
  type Event {
    _id: ID!
    judul: String!
    deskripsi: String!
    harga: Float!
    date: String!
  }

  type User {
    _id: ID!
    nama: String!
    username: String!
    email: String!
    password: String
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
  `),
  rootValue: {
    events: async () => {
      const result = await Event.find()
      if (!result) {
        throw new Error('Couldn\'t get all event')
      }

      return result.map(event => {
        return {
          ...event._doc,
          _id: event._doc._id.toString()
        }
      })
    },
    users: async () => {
      const result = await User.find()
      if(!result){
        throw new Error('Couldn\'t get all user')
      }

      return result.map(user => {
        return {
          ...user._doc,
          _id: user._doc._id.toString()
        }
      })
    },
    createEvent: async (args) => {
      const event = new Event({
        judul: args.EventInput.judul,
        deskripsi: args.EventInput.deskripsi,
        harga: +args.EventInput.harga,
        date: new Date(args.EventInput.date)
      })
      const eventSaved = await event.save()

      if (!eventSaved) {
        throw new Error('Failed to create event')
      }
      return {
        ...eventSaved._doc,
        _id: event._doc._id.toString()
      }
    },
    createUser: async (args) => {
      const hashedPassword = await bcrypt.hash(args.UserInput.password, 12)
      const user = new User({
        nama: args.UserInput.nama,
        username: args.UserInput.username,
        email: args.UserInput.email,
        password: hashedPassword
      })

      const checkUser = await User.findOne({
        $or: [{
          username: user.username,
          email: user.email
        }]
      })

      if (checkUser) {
        throw new Error('User already registered')
      }

      const userSaved = await user.save()
      if (!userSaved) {
        throw new Error('Failed to create user')
      }

      return {
        ...userSaved._doc,
        _id: userSaved._doc._id.toString()
      }
    }
  },
  graphiql: true
}))

app.get('/', (req, res, next) => {
  res.status(200).json({
    list: events
  })
})

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not found - ' + req.originalUrl)
  error.status = 404
  next(error)
})

app.use((req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  })
})

module.exports = app