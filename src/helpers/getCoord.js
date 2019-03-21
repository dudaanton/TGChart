export default (line, x) => {
  const rightIndex = line.findIndex(val => val.x >= x)
  const leftIndex = rightIndex - 1

  if (rightIndex === -1) return 0
  if (leftIndex === -1) return line[rightIndex].y

  const c1 = line[leftIndex]
  const c2 = line[rightIndex]

  const y = (c2.y - c1.y) * (x - c1.x) / (c2.x - c1.x) + c1.y

  return y
}
