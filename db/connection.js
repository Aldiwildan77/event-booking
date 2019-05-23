const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@booking-shard-00-00-x5mc8.gcp.mongodb.net:27017,booking-shard-00-01-x5mc8.gcp.mongodb.net:27017,booking-shard-00-02-x5mc8.gcp.mongodb.net:27017/test?ssl=true&replicaSet=booking-shard-0&authSource=admin&retryWrites=true`,
  { useNewUrlParser: true })
  .then(_ => {
    console.log("Database successfully connected")
  })
  .catch(err => {
    console.log("Failed to connect database " + err)
  })
