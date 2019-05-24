const User = require('../../models/user')
const Event = require('../../models/event')
const Booking = require('../../models/booking')
const { transformBooking, transformEvent } = require('./merge')

module.exports = {
  bookings: async () => {
    try {
      const result = await Booking.find()
      return result.map(booking => {
        return transformBooking(booking)
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  bookEvent: async (args) => {
    try {
      const fetchedUser = await User.findById('5ce745c32968780658c66301')
      if(!fetchedUser){
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
      throw new Error(error)
    }
  },
  cancelBooking: async (args) => {
    try {
      const deletedBooking = await Booking.findOneAndDelete({
        _id: args.bookingID
      }).populate('event')

      return transformEvent(deletedBooking.event)

    } catch (error) {
      throw new Error(error)
    }
  }
}