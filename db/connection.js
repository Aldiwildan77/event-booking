const mongoose = require('mongoose')
const config = require('../config/config').dev.db

mongoose.connect(`mongodb://${config.host}:${config.password}@booking-shard-00-00-x5mc8.gcp.mongodb.net:27017,booking-shard-00-01-x5mc8.gcp.mongodb.net:27017,booking-shard-00-02-x5mc8.gcp.mongodb.net:27017/${config.name}?ssl=true&replicaSet=booking-shard-0&authSource=admin&retryWrites=true`,
  { useNewUrlParser: true, useCreateIndex: true })
  .then(_ => {
    console.log("Database successfully connected")
  })
  .catch(err => {
    console.log("Failed to connect database " + err)
  })
