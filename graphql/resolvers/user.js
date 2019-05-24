const User = require('../../models/user')
const bcrypt = require('bcrypt')
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

      const userSaved = await user.save()
      return {
        ...userSaved._doc,
        _id: userSaved._doc._id.toString()
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}