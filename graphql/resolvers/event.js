const User = require('../../models/user')
const Event = require('../../models/event')
const { dateToString } = require('../../helpers/date')
const { transformEvent } = require('./merge')

module.exports = {
  events: async () => {
    try {
      const result = await Event.find()
      return result.map(event => {
        return transformEvent(event)
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  createEvent: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthenticated')
    }

    try {
      const findUser = await User.findById(req.userId)

      if (!findUser) {
        throw new Error('Couldn\'t find user by id')
      }

      const event = new Event({
        judul: args.EventInput.judul,
        deskripsi: args.EventInput.deskripsi,
        harga: +args.EventInput.harga,
        date: dateToString(args.EventInput.date),
        creator: findUser._id
      })

      const eventSaved = await event.save()
      let createdEvent = transformEvent(eventSaved)

      findUser.createdEvents.push(event)
      await findUser.save()

      return createdEvent

    } catch (error) {
      throw new Error(error)
    }
  },
}