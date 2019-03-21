import Chart from '@/chart/Chart'

export default class Navigation {
  constructor (cb) {
    this.el = document.createElement('div')
    this.el.className = 'tgc-navigation'

    this.cb = cb
  }

  draw (data) {
    this.chart = new Chart('100%', '90%')
    this.chart.el.classList.add('tgc-navigation__chart')

    this.bgc1 = document.createElement('div')
    this.bgc1.className = 'tgc-navigation__background'
    this.bgc2 = document.createElement('div')
    this.bgc2.className = 'tgc-navigation__background'
    this.carriage = document.createElement('div')
    this.carriage.className = 'tgc-navigation__carriage'
    this.grabber = document.createElement('div')
    this.grabber.className = 'tgc-navigation__grabber'
    this.bdr1 = document.createElement('div')
    this.bdr1.className = 'tgc-navigation__border'
    this.bdr2 = document.createElement('div')
    this.bdr2.className = 'tgc-navigation__border'

    this.bgc2.style.right = '0px'
    this.bgc1.style.left = '0px'
    this.carriage.style.left = '0px'
    this.carriage.style.right = '0px'
    this.grabber.style.left = '0px'
    this.grabber.style.right = '0px'
    this.bdr1.style.left = '0px'
    this.bdr2.style.right = '0px'

    this.bdr1.onmousedown = (e) => {
      e.preventDefault()

      this.startTrackLeft(e)

      this.bdr1.ondragstart = () => {
        return false
      }
    }

    this.bdr1.ontouchstart = this.bdr1.onmousedown

    this.bdr2.onmousedown = (e) => {
      e.preventDefault()

      this.startTrackRight(e)

      this.bdr2.ondragstart = () => {
        return false
      }
    }

    this.bdr2.ontouchstart = this.bdr2.onmousedown

    this.grabber.onmousedown = (e) => {
      e.preventDefault()

      this.startTrackingCarriage(e)

      this.grabber.ondragstart = () => {
        return false
      }
    }

    this.grabber.ontouchstart = this.grabber.onmousedown

    this.el.appendChild(this.chart.el)
    this.el.appendChild(this.carriage)
    this.el.appendChild(this.grabber)
    this.el.appendChild(this.bgc1)
    this.el.appendChild(this.bgc2)
    this.el.appendChild(this.bdr1)
    this.el.appendChild(this.bdr2)

    setTimeout(() => {
      const style = {}
      style.thickness = 1

      this.chart.draw(data, style)
    })
  }

  startTrackingCarriage (e) {
    const pageX = e.pageX || e.touches[0].pageX

    const maxWidth = this.el.offsetWidth

    const mouseStartX = pageX
    const leftStartX = parseFloat(this.bdr1.style.left)
    const rightStartX = parseFloat(this.bdr2.style.right)

    const moveAt = (e) => {
      let shiftX = e.pageX - mouseStartX

      if (leftStartX + shiftX < 0) {
        shiftX = -leftStartX
      }

      if (rightStartX - shiftX < 0) {
        shiftX = rightStartX
      }

      this.bdr1.style.left = `${leftStartX + shiftX}px`
      this.bgc1.style.width = `${leftStartX + shiftX}px`
      this.carriage.style.left = this.bdr1.style.left
      this.grabber.style.left = this.bdr1.style.left

      this.bdr2.style.right = `${rightStartX - shiftX}px`
      this.bgc2.style.width = `${rightStartX - shiftX}px`
      this.carriage.style.right = this.bdr2.style.right
      this.grabber.style.right = this.bdr2.style.right

      this.cb({
        left: (leftStartX + shiftX) / maxWidth,
        right: (rightStartX - shiftX) / maxWidth
      })
    }

    this.moveCarriage(moveAt)
  }

  startTrackRight (e) {
    const pageX = e.pageX || e.touches[0].pageX

    const maxWidth = this.el.offsetWidth
    const minCarriageWidth = maxWidth * 0.1

    const mouseStartX = pageX
    const startCoords = parseFloat(this.bdr2.style.right)

    const moveAt = (e) => {
      let shift = startCoords + (mouseStartX - e.pageX)
      const leftX = parseFloat(this.bdr1.style.left)
      const checkDimensions = maxWidth - leftX - shift < minCarriageWidth

      if (checkDimensions) {
        shift = maxWidth - leftX - minCarriageWidth
      } else if (shift < 0) {
        shift = 0
      }

      this.bdr2.style.right = `${shift}px`
      this.bgc2.style.width = `${shift}px`
      this.carriage.style.right = this.bdr2.style.right
      this.grabber.style.right = this.bdr2.style.right

      this.cb({
        left: leftX / maxWidth,
        right: shift / maxWidth
      })
    }

    this.moveCarriage(moveAt)
  }

  startTrackLeft (e) {
    const pageX = e.pageX || e.touches[0].pageX

    const maxWidth = this.el.offsetWidth
    const minCarriageWidth = maxWidth * 0.1

    const mouseStartX = pageX
    const startCoords = parseFloat(this.bdr1.style.left)

    const moveAt = (e) => {
      let shift = startCoords - (mouseStartX - e.pageX)
      const rightX = parseFloat(this.bdr2.style.right)
      const checkDimensions = maxWidth - rightX - shift < minCarriageWidth

      if (checkDimensions) {
        shift = maxWidth - rightX - minCarriageWidth
      } else if (shift < 0) {
        shift = 0
      }

      this.bdr1.style.left = `${shift}px`
      this.bgc1.style.width = `${shift}px`
      this.carriage.style.left = this.bdr1.style.left
      this.grabber.style.left = this.bdr1.style.left

      this.cb({
        left: shift / maxWidth,
        right: rightX / maxWidth
      })
    }

    this.moveCarriage(moveAt)
  }

  moveCarriage (cb) {
    document.onmousemove = (e) => {
      cb({
        pageX: e.pageX,
      })

      document.onmouseup = () => {
        document.ontouchmove = null
        document.onmousemove = null
      }
    }

    document.ontouchmove = (e) => {
      cb({
        pageX: e.touches[0].pageX,
      })

      document.ontouchend = () => {
        document.ontouchmove = null
        document.onmousemove = null
      }
    }
  }

  changeLineView (line, view) {
    this.chart.changeLineView(line, view)
  }

  swithTheme (day) {
    if (day) {
      this.el.classList.remove('night')
    } else {
      this.el.classList.add('night')
    }
  }
}
