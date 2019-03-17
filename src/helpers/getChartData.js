function getXValues (columns, types) {
  const prop = Object.keys(types).find(el => types[el] === 'x')
  let values = columns.find(column => column[0] === prop)

  values = values.slice()
  // values.splice(0, 1)

  return values
}

function getYValues (columns, types) {
  const props = Object.keys(types).filter(el => types[el] !== 'x')
  let values = columns.filter((column) => {
    return props.some((prop) => {
      return column[0] === prop
    })
  })
  values = values.map((el) => {
    const val = el.slice()
    // val.splice(0, 1)

    return val
  })

  return values
}

function getMinMax (values) {
  let sortedValues = values.slice()
  sortedValues.splice(0, 1)
  sortedValues.sort((a, b) => a - b)

  return {
    min: sortedValues[0],
    max: sortedValues[sortedValues.length - 1]
  }
}

// function getColors (colors, columns) {
//   const names = columns
//     .map(el => el[0])
//     .filter(el => el !== 'x')

//   return names.map(name => colors[name])
// }

export default (data) => {
  const xValues = getXValues(data.columns, data.types)
  const yValues = getYValues(data.columns, data.types)
  const xMinMax = getMinMax(xValues)
  // const yMinMax = getMinMax(...yValues)
  const xMax = xMinMax.max
  // const yMax = yMinMax.max
  const xMin = xMinMax.min
  // const yMin = yMinMax.min
  // const xScale = width / (xMax - xMin)
  // const yScale = height / yMax
  // const colors = getColors(data.colors, data.columns)

  const values = yValues.map((val) => {
    return val.reduce((acc, el, id) => {
      const coord = {
        x: xValues[id],
        y: el
      }

      return [...acc, coord]
    }, [])
  })

  const lines = values.map((val) => {
    const lineId = val.splice(0, 1)[0].y
    const yMinMax = getMinMax(val.map(v => v.y))

    return {
      values: val.sort((a, b) => a.x - b.x),
      yMax: yMinMax.max,
      yMin: yMinMax.min,
      color: data.colors[lineId],
      id: lineId,
      name: data.names[lineId]
    }
  })

  return {
    lines,
    xMax,
    xMin
  }

  // values.sort((a, b) => a.x - b.x)
  // relativeValues.sort((a, b) => a.x - b.x)

  // return {
  //   values,
  //   relativeValues,
  //   colors,
  //   xMax,
  //   xMin,
  //   yMax,
  //   yMin,
  //   xScale,
  //   yScale
  // }
}
