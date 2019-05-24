const bcrypt = require('bcrypt')

// Database
const Event = require('../../models/event')
const User = require('../../models/user')

// events
const event = async eventId => {
  try {
    const findEvents = await Event.find({
      _id: {
        $in: eventId
      }
    })

    return findEvents.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

// userid
const user = async userId => {
  try {
    const findUser = await User.findOne(userId)

    return {
      ...findUser._doc,
      _id: findUser.id,
      createdEvents: event.bind(this, findUser._doc.createdEvents)
    }
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  events: async () => {
    try {
      const result = await Event.find()
      return result.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  },
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
  createEvent: async (args) => {
    try {
      const findUser = await User.findById('5ce745c32968780658c66301')

      if(!findUser){
        throw new Error('Couldn\'t find user by id')
      }

      const event = new Event({
        judul: args.EventInput.judul,
        deskripsi: args.EventInput.deskripsi,
        harga: +args.EventInput.harga,
        date: new Date(args.EventInput.date),
        creator: findUser._id
      })

      const eventSaved = await event.save()
      let createdEvent = {
        ...eventSaved._doc,
        _id: event._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, eventSaved._doc.creator)
      }

      findUser.createdEvents.push(event)
      await findUser.save()
      return createdEvent 

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

      if(!checkUser){
        throw new Error('Couldn\'t find user by username or email')
      }

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