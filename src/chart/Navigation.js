import Chart from '@/chart/Chart'

export default class Navigation {
  constructor (cb) {
    this.el = document.createElement('div')
    this.el.style.width = '100%'
    this.el.style.height = '52px'
    this.el.style.position = 'relative'
    this.cb = cb
  }

  draw (data) {
    this.chart = new Chart('100%', '90%')
    this.chart.el.style.top = '5%'
    this.chart.el.style.position = 'absolute'

    this.bgc1 = document.createElement('div')
    this.bgc1.style.height = '100%'
    this.bgc1.style.backgroundColor = '#EEF6FF'
    this.bgc1.style.transition = 'background-color 0.1s ease-out'
    this.bgc1.style.opacity = 0.9
    this.bgc1.style.position = 'absolute'

    this.bgc2 = this.bgc1.cloneNode(true)

    this.bgc2.style.right = '0px'
    this.bgc1.style.left = '0px'

    this.carriage = document.createElement('div')
    this.carriage.style.height = '100%'
    this.carriage.style.boxSizing = 'border-box'
    this.carriage.style.position = 'absolute'
    this.carriage.style.zIndex = -1
    this.carriage.style.left = '0px'
    this.carriage.style.right = '0px'
    this.carriage.style.border = 'solid #DDEAF3'
    this.carriage.style.borderWidth = '1px 4px'
    this.carriage.style.transition = 'border-color 0.1s ease-out'

    this.grabber = document.createElement('div')
    this.grabber.style.height = '100%'
    this.grabber.style.position = 'absolute'
    this.grabber.style.zIndex = 1
    this.grabber.style.left = '0px'
    this.grabber.style.right = '0px'

    this.bdr1 = document.createElement('div')
    this.bdr1.style.width = '8px'
    this.bdr1.style.height = '100%'
    this.bdr1.style.position = 'absolute'
    this.bdr1.style.zIndex = 2

    this.bdr2 = this.bdr1.cloneNode(true)

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
    // const minCarriageWidth = maxWidth * 0.1

    const mouseStartX = pageX
    const leftStartX = parseFloat(this.bdr1.style.left)
    const rightStartX = parseFloat(this.bdr2.style.right)

    const moveAt = (e) => {
      let shiftX = e.pageX - mouseStartX

      // const leftX = parseFloat(this.bdr1.style.left)
      // const rightX = parseFloat(this.bdr2.style.right)

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
    this.bgc1.style.backgroundColor = (day) ? '#EEF6FF' : '#1E2835'
    this.bgc2.style.backgroundColor = (day) ? '#EEF6FF' : '#1E2835'
    this.carriage.style.borderColor = (day) ? '#DDEAF3' : '#40566B'

    // this.chart.swithTheme(day)
  }
}
