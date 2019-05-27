const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { event } = require('./merge')

module.exports = {
  users: async () => {
    try {
      const result = await User.find()
      return result.map(user => {
        return {
          ...user._doc,
          _id: user.id,
          createdEvents: event.bind(this, user._doc.createdEvents)
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  createUser: async (args) => {
    try {
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

      if(checkUser){
        throw new Error('User already exist')
      }

      const userSaved = await user.save()
      return {
        ...userSaved._doc,
        _id: userSaved._doc._id.toString()
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  login: async ({username, password}) => {
    try {
      const userExists = await User.findOne({ username: username })
      if(!userExists) {
        throw new Error('User doesn\'t exist')
      }

      const isEqual = bcrypt.compare(password, userExists.password)
      if(!isEqual){
        throw new Error('Password is incorrect')
      }

      const token = jwt.sign({
        userId: userExists.id,
        username: userExists.username
      }, process.env.DEV_PRIVATE_KEY_JWT, {
        expiresIn: '2h'
      })

      return {
        userId: userExists.id,
        token: token,
        tokenExp: 2
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}