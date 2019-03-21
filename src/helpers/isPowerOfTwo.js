export default (num) => {
  while (num > 1) {
    num /= 2
    if (num === 1) return true
  }

  return false
}
