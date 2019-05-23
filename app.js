const express = require('express')
const morgan = require('morgan')
const graphqlHTTP = require('express-graphql')
const {
  buildSchema
} = require('graphql')


const app = express()

const events = []

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
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
        judul: args.judul,
        deskripsi: args.deskripsi,
        harga: +args.harga,
        date: new Date().toISOString()
      }
      events.push(event)
    }
  },
  graphiql: true
}))

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