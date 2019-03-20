const getMonth = (month) => {
  switch (month) {
    case (0):
      return 'Jan'
    case (1):
      return 'Feb'
    case (2):
      return 'Mar'
    case (3):
      return 'Apr'
    case (4):
      return 'May'
    case (5):
      return 'Jun'
    case (6):
      return 'Jul'
    case (7):
      return 'Aug'
    case (8):
      return 'Sep'
    case (9):
      return 'Oct'
    case (10):
      return 'Nov'
    default:
      return 'Dec'
  }
}

const getWeekDay = (day) => {
  switch (day) {
    case (0):
      return 'Mon'
    case (1):
      return 'Tue'
    case (2):
      return 'Wed'
    case (3):
      return 'Thu'
    case (4):
      return 'Fri'
    case (5):
      return 'Sat'
    default:
      return 'Sun'
  }
}

export default (date, weekDay = false) => {
  const dateObj = new Date()
  dateObj.setTime(date)
  const day = dateObj.getDate()
  const month = getMonth(dateObj.getMonth())

  if (weekDay) {
    const dayOfWeek = getWeekDay(dateObj.getDay())
    return `${dayOfWeek}, ${month} ${day}`
  }

  return `${month} ${day}`
}
