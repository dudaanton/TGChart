import settings from '@/settings'

const ns = 'http://www.w3.org/2000/svg'

export default class Line {
  constructor (props) {
    this.el = document.createElementNS(ns, 'line')
    this.x1 = props.x1 || 0
    this.x2 = props.x2 || 0
    this.y1 = props.y1 || 0
    this.y2 = props.y2 || 0

    this.scaleCoords({
      x: 1,
      y: 1
    })
    this.el.setAttributeNS(null, 'style', `stroke:${props.color || '#fff'};stroke-width:${props.thickness || 1.5};stroke-linecap: round`)
  }

  scaleCoords (scale, height = 1) {
    this.el.setAttributeNS(null, 'x1', this.x1 * scale.x)
    this.el.setAttributeNS(null, 'y1', height - (height - this.y1) * scale.y)
    this.el.setAttributeNS(null, 'x2', this.x2 * scale.x)
    this.el.setAttributeNS(null, 'y2', height - (height - this.y2) * scale.y)
  }
}
