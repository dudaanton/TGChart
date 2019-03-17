import Line from '@/chart/Line'

const ns = 'http://www.w3.org/2000/svg'

export default class Chart {
  constructor () {
    this.el = document.createElementNS(ns, 'svg')
    this.el.setAttributeNS(null, 'height', '100%')
    this.el.setAttributeNS(null, 'width', '100%')
    // this.el.setAttributeNS(null, 'viewBox', '0 0 375 300')
    // this.el.setAttributeNS(null, 'preserveAspectRatio', 'none')
    this.el.style.transition = 'opacity 0.3s ease-out'
    this.el.style.position = 'absolute'
    this.el.style.bottom = '0px'
    // this.el.style.transformOrigin = '100% 100%'
    this.scaleY = 1
    this.left = 0
    this.right = 0
    this.animation = false
  }

  draw (coords, data) {
    this.lines = coords.slice()
    this.data = data

    this.path = document.createElementNS(ns, 'path')
    // this.path.setAttributeNS(null, 'vector-effect', 'non-scaling-stroke')

    let d = this.lines.reduce((acc, line) => {
      acc = `${acc} ${line.x} ${line.y} L`
      return acc
    }, 'M')
    d = d.slice(0, d.length - 3)
    this.path.setAttributeNS(null, 'd', d)

    this.path.style.fill = 'none'
    this.path.style.stroke = data.color
    this.path.style.strokeWidth = `${data.thickness}px`

    this.el.appendChild(this.path)
  }

  changeViewbox (coords) {
    this.el.style.opacity = (coords.visible) ? 1 : 0

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
        shiftDown: coords.shiftDown
      })

      return
    }

    this.scaleY = coords.y

    this.changePath({
      left: coords.left,
      right: coords.right,
      h: coords.h,
      w: coords.w,
      shiftDown: coords.shiftDown
    })
  }

  animate (options) {
    this.scaleY = options.coords.y
    const start = performance.now()

    const circ = (timeFraction) => {
      return 1 - Math.sin(Math.acos(timeFraction))
    }

    requestAnimationFrame(() => {
      const animate = (time) => {
        let timeFraction = (time - start) / options.duration

        if (timeFraction > 1) timeFraction = 1

        const progress = circ(timeFraction)

        this.changePath({
          y: options.y0 + (this.scaleY - options.y0) * timeFraction,
          h: options.coords.h,
          w: options.coords.w,
          left: options.coords.left,
          right: options.coords.right,
          shiftDown: options.coords.shiftDown
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
    const { shiftDown } = coords

    // console.log('shiftDown', shiftDown);

    let d = this.lines.reduce((acc, line) => {
      acc = `${acc} ${line.x * x - shiftLeft} ${coords.h - (coords.h - line.y) * y} L`
      return acc
    }, 'M')

    d = d.slice(0, d.length - 2)

    this.path.setAttributeNS(null, 'd', d)
  }
}
