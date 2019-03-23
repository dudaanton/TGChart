export default (date, weekDay = false) => {
  const dateObj = new Date(date)

  const day = dateObj.getDate()
  const month = dateObj.toString().substring(4, 7)

  if (weekDay) {
    const dayOfWeek = dateObj.toString().substring(0, 3)
    return `${dayOfWeek}, ${month} ${day}`
  }

  return `${month} ${day}`
}
