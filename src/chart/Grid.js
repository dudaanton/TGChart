import Line from '@/chart/Line'

import getDate from '@/helpers/getDate'
import getNum from '@/helpers/getNum'

export default class Grid {
  constructor (width, height) {
    this.el = document.createElement('div')
    this.el.style.width = width
    this.el.style.height = height
    this.el.style.position = 'absolute'
    this.el.style.top = '0px'

    this.yScaleNamesWrapper = document.createElement('div')
    this.yScaleNamesWrapper.style.height = '100%'
    this.yScaleNamesWrapper.style.width = '100%'
    this.yScaleNamesWrapper.style.position = 'absolute'

    const wrapper = document.createElement('div')
    wrapper.style.height = '24px'
    wrapper.style.width = '100%'
    wrapper.style.position = 'absolute'
    wrapper.style.bottom = '-24px'
    wrapper.style.boxSizing = 'border-box'
    wrapper.style.overflow = 'hidden'

    this.xScaleNamesWrapper = document.createElement('div')
    this.xScaleNamesWrapper.style.position = 'absolute'
    this.xScaleNamesWrapper.style.height = '100%'
    this.xScaleNamesWrapper.style.width = '100%'
    // this.xScaleNamesWrapper.style.padding = '0px 6px'
    // this.xScaleNamesWrapper.style.display = 'flex'
    // this.xScaleNamesWrapper.style.justifyContent = 'space-between'
    // this.xScaleNamesWrapper.style.alignItems = 'center'
    // this.xScaleNamesWrapper.style.transition = 'left 0.03s linear, width 0.1s linear'

    wrapper.appendChild(this.xScaleNamesWrapper)
    this.el.appendChild(wrapper)
    this.el.appendChild(this.yScaleNamesWrapper)

    this.xLag = 32
    this.day = true
    this.lines = []
  }

  draw (data) {
    this.data = data
    this.yMax = this.data.yMax
    this.xMin = this.data.xMin
    this.xMax = this.data.xMax

    this.maxViewX = this.xMax
    this.minViewX = this.xMin

    const lineBottom = new Line(0)
    lineBottom.el.style.bottom = '0px'

    this.yScaleNamesWrapper.appendChild(lineBottom.el)

    this.addLines()
    this.addXScaleNames()
  }

  addLines (animate = '', duration) {
    this.step = this.el.offsetHeight * 0.9 / 5
    const valuesStep = this.yMax * 0.9 / 5
    const transform = `translateY(${(animate === 'up') ? '-' : ''}${this.step / 2}px)`

    for (let i = 1; i < 6; i += 1) {
      const beautyNum = getNum(valuesStep * i)
      const line = new Line(beautyNum, this.day)

      line.el.style.bottom = `${this.step * i}px`
      line.el.style.transition = `transform ${duration}ms linear, opacity ${duration}ms linear`
      line.el.style.transform = (animate) ? transform : null
      line.el.style.opacity = (animate) ? 0 : 1

      this.yScaleNamesWrapper.appendChild(line.el)
      setTimeout(() => {
        line.el.style.transform = 'translateY(0px)'
        line.el.style.opacity = 1
      })
    }
  }

  createXScaleNameElement (name, scale) {
    const el = document.createElement('div')
    el.innerHTML = name
    el.style.position = 'absolute'
    el.style.top = '4px'
    el.style.font = '10px sans-serif'
    el.style.fontWeight = '300'
    el.style.whiteSpace = 'nowrap'
    el.style.color = (this.day) ? '#98A3AC' : '#526677'
    el.style.opacity = 0
    el.style.transform = 'translateX(4px)'
    el.dataset.scale = scale
    el.style.transition = 'opacity 0.1s linear'

    const line = document.createElement('div')
    line.style.position = 'absolute'
    line.style.top = '-4px'
    line.style.height = '16px'
    line.style.width = '1px'
    line.style.transform = 'translateX(-4px)'
    line.style.backgroundColor = (this.day) ? '#F2F4F5' : '#3B4A5A'

    el.appendChild(line)

    setTimeout(() => {
      el.style.opacity = 1
    })

    return el
  }

  isPowerOfTwo (num) {
    while (num > 1) {
      num /= 2
      if (num === 1) return true
    }

    return false
  }

  addXScaleNames () {
    const delta = this.xMax - this.xMin
    const step = delta / 6

    for (let i = 0; i < 6; i += 1) {
      const x = this.xMin + step * i
      const date = getDate(x)
      const el = this.createXScaleNameElement(date, 0)
      el.style.left = `${i / 6 * 100}%`

      this.xScaleNamesWrapper.appendChild(el)
    }

    this.xScaleRound = Math.round(this.xScaleNamesWrapper.offsetWidth / this.el.offsetWidth)
  }

  scaleXScaleNames (leftX, rightX, scaleX) {
    const left = (leftX - this.xMin) * scaleX
    this.xScaleNamesWrapper.style.left = `${-left}px`

    const scaleWidth = ((leftX - this.xMin + this.xMax - rightX) * scaleX + this.el.offsetWidth)
    this.xScaleNamesWrapper.style.width = `${scaleWidth}px`

    const xScaleRound = Math.floor(scaleWidth / this.el.offsetWidth)

    if (xScaleRound > this.xScaleRound && this.isPowerOfTwo(xScaleRound)) {
      const delta = this.xMax - this.xMin
      const step = delta / 6 / xScaleRound

      for (let i = 1; i < 6 * xScaleRound; i += 2) {
        const x = this.xMin + step * i
        console.log('this.data.lines', this.data.lines);
        const date = getDate(x)
        const el = this.createXScaleNameElement(date, xScaleRound)
        el.style.left = `${i / 6 / xScaleRound * 100}%`

        this.xScaleNamesWrapper.insertBefore(el, this.xScaleNamesWrapper.children[i])
      }
    } else if (xScaleRound < this.xScaleRound) {
      [...this.xScaleNamesWrapper.children].forEach((el) => {
        if (el.dataset.scale !== 'removed' && el.dataset.scale > xScaleRound) {
          const deleteNode = () => {
            el.removeEventListener('transitionend', deleteNode)
            el.remove()
          }

          el.dataset.scale = 'removed'
          el.addEventListener('transitionend', deleteNode)
          el.style.opacity = 0
        }
      })
    }

    this.xScaleRound = xScaleRound
  }

  changeGrid (data) {
    if (data.maxViewY !== this.yMax) {
      const up = data.maxViewY > this.yMax;
      this.yMax = data.maxViewY;

      [...this.yScaleNamesWrapper.children].forEach((line) => {
        const deleteNode = () => {
          line.removeEventListener('transitionend', deleteNode)
          line.remove()
        }

        if (line.style.bottom !== '0px') {
          line.addEventListener('transitionend', deleteNode)
          line.style.transform = `translateY(${(up) ? '' : '-'}${this.step / 2}px)`
          line.style.opacity = 0
        }
      })

      this.addLines((up) ? 'up' : 'down', data.duration)
    }

    this.scaleXScaleNames(data.leftX, data.rightX, data.scaleX)
  }

  swithTheme (day) {
    this.day = day;

    [...this.yScaleNamesWrapper.children].forEach((line) => {
      line.children[0].style.backgroundColor = (day) ? '#F2F4F5' : '#3B4A5A'
      line.children[1].style.color = (day) ? '#98A3AC' : '#526677'
    });
    [...this.xScaleNamesWrapper.children].forEach((el) => {
      el.style.color = (this.day) ? '#98A3AC' : '#526677'
      el.children[0].style.backgroundColor = (day) ? '#F2F4F5' : '#3B4A5A'
    })
  }
}
