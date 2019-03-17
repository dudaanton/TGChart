import getChartData from '@/helpers/getChartData'
import CompositeLine from '@/chart/CompositeLine'

export default class Chart {
  constructor (width, height) {
    this.el = document.createElement('div')
    this.el.style.width = width
    this.el.style.height = height
    this.el.style.position = 'absolute'
    this.el.style.overflow = 'hidden'

    this.wrapper = document.createElement('div')
    this.wrapper.style.position = 'absolute'
    this.wrapper.style.width = '100%'
    this.wrapper.style.height = '100%'
    this.el.appendChild(this.wrapper)

    this.lines = []
  }

  draw (data, style = {}) {
    // this.data = getChartData(data, this.el.offsetHeight, this.el.offsetWidth)
    this.data = data

    this.xMin = this.data.xMin
    this.xMax = this.data.xMax

    this.yMin = Math.min(...this.data.lines.map(line => line.yMin))
    this.yMax = Math.max(...this.data.lines.map(line => line.yMax))

    this.xScale = this.el.offsetWidth / (this.xMax - this.xMin)
    this.yScale = this.el.offsetHeight / this.yMax

    this.data.lines.forEach((l, id) => {
      const values = this.getRelativeValues(l.values)
      const line = new CompositeLine()

      line.draw(values, {
        color: l.color,
        thickness: style.thickness || 1.5
      })

      this.lines.push({
        obj: line,
        name: l.name,
        visible: true
      })

      this.wrapper.appendChild(line.el)
    })
  }

  getRelativeValues (values) {
    return values.map((v) => {
      return {
        x: (v.x - this.xMin) * this.xScale,
        y: this.el.offsetHeight - v.y * this.yScale
      }
    })
  }

  changeViewbox (coords) {
    const scaleX = 1 / (1 - coords.left - coords.right)

    const leftX = (this.xMax - this.xMin) * coords.left + this.xMin
    const rightX = this.xMax - (this.xMax - this.xMin) * coords.right

    let values = this.data.lines.reduce((acc, line) => {
      if (!this.lines.find(l => l.name === line.name).visible) return acc

      return [
        ...acc,
        ...line.values
      ]
    }, [])

    const leftIndex = values.findIndex(val => val.x > leftX)
    const rightIndex = values.findIndex(val => val.x > rightX)

    values = values.slice(leftIndex, rightIndex)
    const maxViewY = Math.max(...values.map(v => v.y))

    const scaleY = this.yMax / maxViewY

    // this.el.style.left = `${-shiftLeft}px`
    // this.wrapper.style.width = `${this.el.offsetWidth * scaleX}px`
    // console.log({
    //   x: scaleX,
    //   y: scaleY,
    //   left: coords.left,
    //   right: coords.right,
    //   h: this.el.offsetHeight,
    //   w: this.el.offsetWidth
    // });

    setTimeout(() => {
      this.lines.forEach((line) => {
        line.obj.changeViewbox({
          x: scaleX,
          y: scaleY,
          left: coords.left,
          right: coords.right,
          h: this.el.offsetHeight,
          w: this.el.offsetWidth
        })
      })
    })
  }
}
