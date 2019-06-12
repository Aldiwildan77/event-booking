const User = require('../../models/user')
const Event = require('../../models/event')
const Booking = require('../../models/booking')
const {
  transformBooking,
  transformEvent
} = require('./merge')

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    try {
      const result = await Booking.find()
      return result.map(booking => {
        return transformBooking(booking)
      })
    } catch (error) {
      throw error
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    try {
      const fetchedUser = await User.findById(req.userId)
      if (!fetchedUser) {
        throw new Error('User doesn\'t registered')
      }

      const fetchedEvent = await Event.findOne({
        _id: args.eventId
      })
      if (!fetchedEvent) {
        throw new Error('Couldn\'t find specific Event')
      }

      const booking = new Booking({
        event: fetchedEvent,
        user: fetchedUser
      })

      const bookingSaved = await booking.save()
      return transformBooking(bookingSaved)
    } catch (error) {
      throw error
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    try {
      const deletedBooking = await Booking.findOneAndDelete({
        _id: args.bookingID
      }).populate('event')

      return transformEvent(deletedBooking.event)

    } catch (error) {
      throw error
    }
  }
}