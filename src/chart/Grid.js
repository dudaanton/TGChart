import Line from '@/chart/Line'

import getDate from '@/helpers/getDate'
import getNum from '@/helpers/getNum'
import isPowerOfTwo from '@/helpers/isPowerOfTwo'

export default class Grid {
  constructor () {
    this.el = document.createElement('div')
    this.el.className = 'tgc-grid'

    this.yScaleNamesWrapper = document.createElement('div')
    this.yScaleNamesWrapper.className = 'tgc-grid__names-wrapper'
    this.xScaleNamesWrapper = document.createElement('div')
    this.xScaleNamesWrapper.className = 'tgc-grid__names-wrapper'

    const wrapper = document.createElement('div')
    wrapper.className = 'tgc-grid__wrapper'

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
      line.el.style.transitionDuration = `${duration}ms`
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
    el.className = 'tgc-grid__date'
    el.innerHTML = name
    el.dataset.scale = scale

    const line = document.createElement('div')
    el.appendChild(line)

    setTimeout(() => {
      el.style.opacity = 1
    })

    return el
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
    const right = (this.xMax - rightX) * scaleX
    this.xScaleNamesWrapper.style.left = `${-left}px`

    const scaleWidth = left + right + this.el.offsetWidth
    this.xScaleNamesWrapper.style.width = `${scaleWidth}px`

    const xScaleRound = Math.floor(scaleWidth / this.el.offsetWidth)

    if (xScaleRound > this.xScaleRound && isPowerOfTwo(xScaleRound)) {
      const delta = this.xMax - this.xMin
      const step = delta / 6 / xScaleRound

      for (let i = 1; i < 6 * xScaleRound; i += 2) {
        const x = this.xMin + step * i
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

    if (this.day) {
      this.yScaleNamesWrapper.classList.remove('night')
      this.xScaleNamesWrapper.classList.remove('night')
    } else {
      this.yScaleNamesWrapper.classList.add('night')
      this.xScaleNamesWrapper.classList.add('night')
    }
  }
}
