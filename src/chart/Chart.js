import CompositeLine from '@/chart/CompositeLine'
import InfoBlock from '@/chart/InfoBlock'

import getCoord from '@/helpers/getCoord'

export default class Chart {
  constructor (width, height) {
    this.el = document.createElement('div')
    this.el.style.width = width
    this.el.style.height = height
    this.el.style.position = 'relative'

    this.wrapper = document.createElement('div')
    this.wrapper.style.position = 'absolute'
    this.wrapper.style.width = '100%'
    this.wrapper.style.height = '100%'
    this.el.appendChild(this.wrapper)

    this.shiftRight = 0
    this.shiftLeft = 0
    this.scaleY = 1

    this.lines = []
  }

  draw (data, style = {}, hasInfo = false) {
    // this.data = getChartData(data, this.el.offsetHeight, this.el.offsetWidth)
    this.data = data

    this.xMin = this.data.xMin
    this.xMax = this.data.xMax
    this.yMin = this.data.yMin
    this.yMax = this.data.yMax

    this.xScale = this.el.offsetWidth / (this.xMax - this.xMin)
    this.yScale = this.el.offsetHeight / this.yMax

    this.data.lines.forEach((l) => {
      const values = this.getRelativeValues(l.values)
      const line = new CompositeLine()

      line.draw(values, {
        color: l.color,
        thickness: style.thickness || 2
      })

      this.lines.push({
        obj: line,
        values: l.values,
        color: l.color,
        name: l.name,
        id: l.id,
        visible: true
      })

      this.wrapper.appendChild(line.el)
    })

    if (hasInfo) {
      const movementCatch = document.createElement('div')
      movementCatch.style.width = 'calc(100% + 2px)'
      movementCatch.style.height = 'calc(100% + 24px)'
      movementCatch.style.position = 'absolute'
      movementCatch.style.bottom = 0
      movementCatch.style.zIndex = 4

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
    let offsetX = e.offsetX || e.touches[0].pageX - this.el.getBoundingClientRect().left
    if (offsetX < 0) {
      offsetX = 0
    } else if (offsetX > this.el.offsetWidth) {
      offsetX = this.el.offsetWidth
    }

    const scaleX = 1 / (1 - this.shiftLeft - this.shiftRight)
    const scaleY = this.scaleY * this.yScale
    // const x = offsetX / (this.xScale * scaleX) + this.xMin
    // const x = (offsetX + this.shiftLeft * this.el.offsetWidth + this.shiftLeft * this.el.offsetWidth * (scaleX)) / scaleX / this.xScale + this.xMin

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

    // console.log('this.shiftRight', this.shiftRight);
    // console.log('this.shiftLeft', this.shiftLeft);

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
    const minViewY = Math.min(...values.map(v => v.y))
    // const maxViewX = (values.length) ? values[values.length - 1].x : this.xMin
    // const minViewX = (values.length) ? values[0].x : this.xMax

    // to do: shift down
    const shiftDown = (maxViewY - minViewY) / maxViewY

    // console.log('shiftDown', shiftDown);
    this.scaleY = this.yMax / maxViewY

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
          y: this.scaleY,
          left: coords.left,
          right: coords.right,
          h: this.el.offsetHeight,
          w: this.el.offsetWidth,
          visible: line.visible,
          duration,
          shiftDown
        })
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

  swithTheme (day) {
    if (this.infoBlock) this.infoBlock.swithTheme(day)
  }
}
