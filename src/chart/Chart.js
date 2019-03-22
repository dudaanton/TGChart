import CompositeLine from '@/chart/CompositeLine'
import InfoBlock from '@/chart/InfoBlock'

import getCoord from '@/helpers/getCoord'

export default class Chart {
  constructor (width, height) {
    this.el = document.createElement('div')
    this.el.className = 'tgc-chart'
    this.el.style.width = width
    this.el.style.height = height

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'tgc-chart__wrapper'
    this.el.appendChild(this.wrapper)

    this.shiftRight = 0
    this.shiftLeft = 0
    this.scaleY = 1
    this.scaleYOld = 1
    this.animation = false

    this.lines = []
    this.paths = []
  }

  draw (data, style = {}, hasInfo = false) {
    this.data = data

    this.xMin = this.data.xMin
    this.xMax = this.data.xMax
    this.yMin = this.data.yMin
    this.yMax = this.data.yMax

    this.xScale = this.el.offsetWidth / (this.xMax - this.xMin)
    this.yScale = this.el.offsetHeight / this.yMax

    this.data.lines.forEach((l) => {
      const values = this.getRelativeValues(l.values)

      this.paths.push({
        values,
        color: l.color,
        thickness: style.thickness || 2
      })

      this.lines.push({
        values: l.values,
        color: l.color,
        name: l.name,
        id: l.id,
        visible: true
      })
    })

    this.drawCanvas()

    if (hasInfo) {
      const movementCatch = document.createElement('div')
      movementCatch.className = 'tgc-chart__movement-catch'

      this.infoBlock = new InfoBlock(this.lines, true)
      this.el.appendChild(this.infoBlock.el)
      this.el.appendChild(movementCatch)

      this.el.onmouseenter = (e) => {
        document.onmousemove = (e) => {
          this.showInfoBlock(e)
        }
      }

      this.el.ontouchstart = (e) => {
        movementCatch.ontouchmove = (e) => {
          e.preventDefault()
          movementCatch.ondragstart = () => {
            return false
          }
          this.showInfoBlock(e)
        }
      }

      this.el.ontouchend = (e) => {
        movementCatch.onmousemove = null
        this.hideInfoBlock()
      }

      this.el.onmouseleave = (e) => {
        document.onmousemove = null
        this.hideInfoBlock()
      }
    }
  }

  showInfoBlock (e) {
    let offsetX = (e.offsetX !== undefined) ? e.offsetX : e.touches[0].pageX - this.el.getBoundingClientRect().left
    if (offsetX < 0) {
      offsetX = 0
    } else if (offsetX > this.el.offsetWidth) {
      offsetX = this.el.offsetWidth
    }

    const scaleY = this.scaleY * this.yScale

    const l = this.xMin + (this.xMax - this.xMin) * this.shiftLeft
    const r = this.xMax - (this.xMax - this.xMin) * this.shiftRight

    const x = offsetX / this.el.offsetWidth * (r - l) + l

    const values = []

    this.lines.forEach((line) => {
      if (!line.visible) return

      const coord = getCoord(line.values, x).toFixed()

      values.push(coord)
    })

    this.infoBlock.draw(values, x, offsetX, this.el.offsetWidth, scaleY)
  }

  hideInfoBlock () {
    this.infoBlock.hide()
  }

  getRelativeValues (values) {
    return values.map((v) => {
      return {
        x: (v.x - this.xMin) * this.xScale,
        y: this.el.offsetHeight - v.y * this.yScale
      }
    })
  }

  changeLineView (line, view, cb) {
    this.lines.find(l => l.id === line).visible = view

    if (this.infoBlock) {
      this.infoBlock.applyData(this.lines, true)
    }

    this.changeViewbox({
      right: this.shiftRight || 0,
      left: this.shiftLeft || 0,
    }, 300, cb)
  }

  changeViewbox (coords, duration, cb) {
    this.shiftRight = coords.right
    this.shiftLeft = coords.left

    const scaleX = 1 / (1 - coords.left - coords.right)

    const leftX = this.xMin + (this.xMax - this.xMin) * coords.left
    const rightX = this.xMax - (this.xMax - this.xMin) * coords.right

    let values = this.lines.reduce((acc, line) => {
      if (!line.visible) return acc

      return [
        ...acc,
        ...line.values
      ]
    }, [])

    let leftIndex = values.findIndex(val => val.x >= leftX)
    let rightIndex = values.findIndex(val => val.x >= rightX)

    values = values.slice(leftIndex, rightIndex + 1)
    const maxViewY = Math.max(...values.map(v => v.y))

    this.scaleY = this.yMax / maxViewY

    setTimeout(() => {
      this.changeCanvas({
        x: scaleX,
        left: coords.left,
        right: coords.right,
        duration,
      })
    })

    if (cb) {
      cb({
        leftX,
        rightX,
        maxViewY: (maxViewY === -Infinity) ? this.yMax : maxViewY,
        duration: duration || 120,
        scaleX: this.xScale * scaleX
      })
    }
  }

  drawCanvas () {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.el.offsetWidth
    this.canvas.height = this.el.offsetHeight
    this.wrapper.appendChild(this.canvas)

    const ctx = this.canvas.getContext('2d')

    this.paths.forEach((path) => {
      ctx.strokeStyle = path.color
      ctx.lineWidth = path.thickness

      const lines = path.values.slice(0, path.values.length - 2)

      lines.forEach((line, id) => {
        ctx.beginPath()
        ctx.moveTo(path.values[id].x, path.values[id].y)
        ctx.lineTo(path.values[id + 1].x, path.values[id + 1].y)
        ctx.closePath()
        ctx.stroke()
      })
    })
  }

  changeCanvas (coords) {
    this.left = coords.left
    this.right = coords.right

    if (this.animation) {
      this.scaleYOld = this.scaleY

      return
    }

    if (this.scaleYOld !== this.scaleY) {
      this.animation = true
      this.animate({
        duration: coords.duration || 120,
        coords,
        y0: this.scaleYOld,
      })

      return
    }

    this.scaleYOld = this.scaleY

    this.changePaths({
      left: coords.left,
      right: coords.right,
    })
  }

  animate (options) {
    this.scaleYOld = this.scaleY
    const start = performance.now()

    requestAnimationFrame(() => {
      const animate = (time) => {
        let timeFraction = (time - start) / options.duration

        if (timeFraction > 1) timeFraction = 1

        this.changePaths({
          y: options.y0 + (this.scaleYOld - options.y0) * timeFraction,
          left: options.coords.left,
          right: options.coords.right,
        });

        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animation = false
        }
      }

      requestAnimationFrame(animate)
    });
  }

  changePaths (coords) {
    const y = coords.y || this.scaleY
    const x = 1 / (1 - coords.left - coords.right)
    const shiftLeft = coords.left * this.el.offsetWidth * x

    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.paths.forEach((path) => {
      ctx.strokeStyle = path.color
      ctx.lineWidth = path.thickness

      const lines = path.values.slice(0, path.values.length - 2)

      lines.forEach((line, id) => {
        const newX1 = path.values[id].x * x - shiftLeft
        const newX2 = path.values[id + 1].x * x - shiftLeft
        if ((newX1 < 0 && newX2 < 0) || (newX1 > this.el.offsetWidth && newX2 > this.el.offsetWidth)) return

        ctx.beginPath()
        ctx.moveTo(newX1, this.el.offsetHeight - (this.el.offsetHeight - path.values[id].y) * y)
        ctx.lineTo(newX2, this.el.offsetHeight - (this.el.offsetHeight - path.values[id + 1].y) * y)
        ctx.closePath()
        ctx.stroke()
      })
    })
  }

  swithTheme (day) {
    if (this.infoBlock) this.infoBlock.swithTheme(day)
  }
}
