export default (num) => {
  if (num > 1000000) {
    num /= 1000000
    return `${num.toFixed(2)}M`
  }
  if (num > 1000) {
    num /= 1000
    return `${num.toFixed(2)}K`
  }
  return num.toFixed()
}
