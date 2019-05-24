const express = require('express')
const morgan = require('morgan')
const graphqlHTTP = require('express-graphql')

const app = express()

const graphQLSchema = require('./graphql/schema')
const graphQLResolvers = require('./graphql/resolvers')
const isAuth = require('./middleware/auth')

// Mongodb
require('./db/connection')

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(isAuth)

app.use('/graphql', graphqlHTTP({
  schema: graphQLSchema,
  rootValue: graphQLResolvers,
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