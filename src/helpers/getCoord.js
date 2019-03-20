export default (line, x) => {
  const rightIndex = line.findIndex(val => val.x >= x)
  const leftIndex = rightIndex + 1

  if (rightIndex === -1 || leftIndex > line.length - 1) return x

  const coordLeft = line[leftIndex]
  const coordRight = line[rightIndex]
  const k = (coordRight.y - coordLeft.y) / (coordRight.x - coordLeft.x)

  return k * x
}
