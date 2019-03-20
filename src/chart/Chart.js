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
        thickness: style.thickness || 1.5
      })

      this.lines.push({
        obj: line,
        id: l.id,
        visible: true
      })

      this.wrapper.appendChild(line.el)
    })

    if (hasInfo) {
      const movementCatch = document.createElement('div')
      movementCatch.style.width = '100%'
      movementCatch.style.height = 'calc(100% + 24px)'
      movementCatch.style.position = 'absolute'
      movementCatch.style.bottom = 0
      movementCatch.style.zIndex = 4

      this.infoBlock = new InfoBlock(this.data.lines, true)
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
    console.log('e', e.touches[0].pageX);
    console.log('this.el.getBoundingClientRect.left', this.el.getBoundingClientRect().left);
    const offsetX = e.offsetX || e.touches[0].pageX - this.el.getBoundingClientRect().left
    const scaleX = 1 / (1 - this.shiftLeft - this.shiftRight)
    const x = offsetX / (this.xScale * scaleX)
    const values = []

    this.data.lines.forEach((line) => {
      const coord = {
        x,
        y: getCoord(line.values, x).toFixed()
      }

      values.push(coord)
    })

    this.infoBlock.draw(values, offsetX, this.yScale)
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

    let values = this.data.lines.reduce((acc, line) => {
      if (!this.lines.find(l => l.id === line.id).visible) return acc

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
}
