import Line from '@/chart/Line'

const ns = 'http://www.w3.org/2000/svg'

export default class Chart {
  constructor () {
    this.el = document.createElementNS(ns, 'svg')
    this.el.setAttributeNS(null, 'height', '100%')
    this.el.setAttributeNS(null, 'width', '100%')
    // this.el.setAttributeNS(null, 'viewBox', '0 0 375 300')
    // this.el.setAttributeNS(null, 'preserveAspectRatio', 'none')
    // this.el.style.transition = 'all 0.5s ease-out'
    this.el.style.position = 'absolute'
    this.el.style.bottom = '0px'
    // this.el.style.transformOrigin = '100% 100%'
    this.scaleY = 1
    this.scaleX = 1
    this.animation = false
  }

  draw (coords, data) {
    this.lines = coords.slice()
    this.data = data

    // this.lines = lines.map((coord, id) => {
    //   if (id === lines.length - 1) return {}

    //   const line = new Line({
    //     x1: coord.x,
    //     y1: coord.y,
    //     x2: lines[id + 1].x,
    //     y2: lines[id + 1].y,
    //     color: data.color,
    //     thickness: data.thickness
    //   }, [])

    //   return line
    // })

    // this.lines.splice(lines.length - 1, 1)

    // this.lines.forEach(line => this.el.appendChild(line.el))

    this.path = document.createElementNS(ns, 'path')
    this.path.setAttributeNS(null, 'vector-effect', 'non-scaling-stroke')

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

    // let viewbox
    // let i = 0

    // setInterval(() => {
    //   viewbox = `${i} 0 ${375 - i} 300`
    //   i += 1
    //   this.el.setAttributeNS(null, 'viewBox', viewbox)
    // }, 50)
  }

  changeViewbox (coords) {
    if (this.animation) {
      this.scaleY = coords.y
      this.scaleX = coords.x

      return
    }

    if (this.scaleY !== coords.y) {
      this.animation = true
      this.animate({
        duration: 50,
        coords,
        y0: this.scaleY
      })
    }

    this.scaleY = coords.y
    this.scaleX = coords.x

    this.changePath({
      left: coords.left,
      h: coords.h
    })
  }

  animate (options) {
    const start = performance.now()
    const changePath = this.changePath.bind(this)
    this.scaleY = options.y0
    const y = this.scaleY

    console.log('this.scaleY', y);

    function circ (timeFraction) {
      return 1 - Math.sin(Math.acos(timeFraction))
    }

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / options.duration

      if (timeFraction > 1) timeFraction = 1

      const progress = circ(timeFraction)

      changePath({
        y: y + (y - options.y0) * progress,
        h: options.coords.h,
        left: options.coords.left
      });

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });

    this.animation = false
  }

  changePath (coords) {
    const y = coords.y || this.scaleY

    console.log('y', y);

    let d = this.lines.reduce((acc, line) => {
      acc = `${acc} ${line.x * this.scaleX - coords.left} ${coords.h - (coords.h - line.y) * y} L`
      return acc
    }, 'M')
    d = d.slice(0, d.length - 3)
    this.path.setAttributeNS(null, 'd', d)
  }

  // changeViewbox (coords) {
  //   // this.lines.forEach((line) => {
  //   //   line.scaleCoords({
  //   //     x: scale.x,
  //   //     y: scale.y,
  //   //   }, height)
  //   // })

  //   let d = this.lines.reduce((acc, line) => {
  //     acc = `${acc} ${line.x * coords.x - coords.left} ${coords.h - (coords.h - line.y) * coords.y} L`
  //     return acc
  //   }, 'M')
  //   d = d.slice(0, d.length - 3)
  //   this.path.setAttributeNS(null, 'd', d)

  //   // let d = this.lines.reduce((acc, line) => {
  //   //   acc = `${acc} ${line.x * coords.x - coords.left} ${line.y} L`
  //   //   return acc
  //   // }, 'M')
  //   // d = d.slice(0, d.length - 3)
  //   // this.path.setAttributeNS(null, 'd', d)


  //   // const viewbox = `${coords.left} 0 ${coords.w - coords.right - coords.left} ${coords.h}`
  //   // this.el.setAttributeNS(null, 'viewBox', viewbox)

  //   // console.log('coords.right, coords.left', coords.right, coords.left);


  //   // const viewbox = `0 ${coords.h - (coords.h / coords.y)} 375 ${coords.h / coords.y}`

  //   // let viewbox
  //   // let i = 0

  //   // setInterval(() => {
  //   //   viewbox = `${i} 0 ${375 - i} 300`
  //   //   i += 1
  //   //   this.el.setAttributeNS(null, 'viewBox', viewbox)
  //   // }, 200)

  //   // this.el.setAttributeNS(null, 'viewBox', viewbox)
  //   // this.path.style.strokeWidth = `${this.data.thickness / coords.y / coords.y}px`
  // }
}
