const express = require('express')
const morgan = require('morgan')
const graphqlHTTP = require('express-graphql')

const app = express()

const {
  buildSchema
} = require('graphql')

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
  type RootQuery {
    events: [String!]!
  } 
  
  type RootMutation {
    createEvent(name: String): String
  }

  schema {
      query: RootQuery
      mutation: RootMutation 
    }
  `),
  rootValue: {
    events: () => {
      return ['Memasak', 'Berlayar']
    },
    createEvent: (args) => {
      const eventName = args.name
      return eventName
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