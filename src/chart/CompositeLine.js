const ns = 'http://www.w3.org/2000/svg'

export default class Chart {
  constructor () {
    this.el = document.createElementNS(ns, 'svg')
    this.el.setAttributeNS(null, 'height', '100%')
    this.el.setAttributeNS(null, 'width', '100%')
    this.el.classList.add('tgc-composite-line')

    this.scaleY = 1
    this.left = 0
    this.right = 0
    this.animation = false
  }

  draw (coords, data) {
    this.lines = coords.slice()
    this.data = data

    this.path = document.createElementNS(ns, 'path')

    let d = this.lines.reduce((acc, line) => {
      acc = `${acc} ${line.x} ${line.y} L`
      return acc
    }, 'M')
    d = d.slice(0, d.length - 2)
    this.path.setAttributeNS(null, 'd', d)

    this.path.style.fill = 'none'
    this.path.style.stroke = data.color
    this.path.style.strokeWidth = `${data.thickness}px`

    this.el.appendChild(this.path)
  }

  changeViewbox (coords) {
    if (coords.visible) {
      this.el.classList.remove('tgc-composite-line_hidden')
    } else {
      this.el.classList.add('tgc-composite-line_hidden')
    }

    this.left = coords.left
    this.right = coords.right

    if (this.animation) {
      this.scaleY = coords.y

      return
    }

    if (this.scaleY !== coords.y) {
      this.animation = true
      this.animate({
        duration: coords.duration || 120,
        coords,
        y0: this.scaleY,
      })

      return
    }

    this.scaleY = coords.y

    this.changePath({
      left: coords.left,
      right: coords.right,
      h: coords.h,
      w: coords.w,
    })
  }

  animate (options) {
    this.scaleY = options.coords.y
    const start = performance.now()

    requestAnimationFrame(() => {
      const animate = (time) => {
        let timeFraction = (time - start) / options.duration

        if (timeFraction > 1) timeFraction = 1

        this.changePath({
          y: options.y0 + (this.scaleY - options.y0) * timeFraction,
          h: options.coords.h,
          w: options.coords.w,
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

  changePath (coords) {
    const y = coords.y || this.scaleY
    const x = 1 / (1 - this.left - this.right)
    const shiftLeft = this.left * coords.w * x
    const lines = this.lines.slice(0, this.lines.length - 1)

    const x1 = this.lines[0].x * x - shiftLeft
    const y1 = coords.h - (coords.h - this.lines[0].y) * y

    let d = lines.reduce((acc, line, id) => {
      const x1 = this.lines[id].x * x - shiftLeft
      const x2 = this.lines[id + 1].x * x - shiftLeft
      const y2 = coords.h - (coords.h - this.lines[id + 1].y) * y

      if ((x1 < 0 && x2 < 0) || (x1 > coords.w * x && x2 > coords.w * x)) return acc
      acc = `${acc} L ${x2} ${y2}`
      return acc
    }, `M ${x1} ${y1}`)

    this.path.setAttributeNS(null, 'd', d)
  }
}
