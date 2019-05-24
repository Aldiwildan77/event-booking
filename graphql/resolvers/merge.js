const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const event = async eventId => {
  try {
    const findEvents = await Event.find({
      _id: {
        $in: eventId
      }
    })

    return findEvents.map(event => {
      return transformEvent(event)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const singleEvent = async eventId => {
  try {
    const findSingleEvent = await Event.findOne({
      _id: {
        $in: eventId
      }
    })

    return transformEvent(findSingleEvent)

  } catch (error) {
    throw new Error(error)
  }
}

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

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  }
}

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}

exports.event = event
exports.transformEvent = transformEvent
exports.transformBooking = transformBooking