const express = require('express')
const morgan = require('morgan')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()
const events = []

// Mongodb
require('./db/connection')

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
  type Event {
    _id: ID!
    judul: String!
    deskripsi: String!
    harga: Float!
    date: String!
  }

  input EventInput {
    judul: String!
    deskripsi: String!
    harga: Float!
    date: String!
  }

  type RootQuery {
    events: [Event!]!
  } 
  
  type RootMutation {
    createEvent(EventInput: EventInput): Event
  }

  schema {
      query: RootQuery
      mutation: RootMutation 
    }
  `),
  rootValue: {
    events: () => {
      return events
    },
    createEvent: (args) => {
      const event = {
        _id: Math.random().toString(),
        judul: args.EventInput.judul,
        deskripsi: args.EventInput.deskripsi,
        harga: +args.EventInput.harga,
        date: new Date().toISOString().slice(0, 10)
      }
      events.push(event)
      return event
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