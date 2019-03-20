export default class InfoBlock {
  constructor (lines, day) {
    this.el = document.createElement('div')
    this.el.style.position = 'absolute'
    // this.el.className = 'infoBlock'
    this.el.style.height = '100%'
    this.el.style.opacity = 0
    this.el.style.transition = 'opacity 0.3s ease-out'

    this.wrapper = document.createElement('div')
    this.wrapper.style.position = 'absolute'
    this.wrapper.style.top = 0
    this.wrapper.style.zIndex = 3
    this.wrapper.style.transform = 'translate(-30%, -30%)'
    this.wrapper.style.padding = '8px 14px 8px 10px'
    this.wrapper.style.borderRadius = '4px'
    this.wrapper.style.backgroundColor = '#fff'
    this.wrapper.style.boxShadow = '0px 0.3px 1px 0.3px #DBDBDB'
    this.wrapper.style.boxShadow = '0px 0.5px 1px 0.3px rgba(#DBDBDB, 0.37)'

    this.date = document.createElement('div')
    this.date.innerHTML = 'Sat, Feb 24'
    this.date.style.marginBottom = '14px'
    this.date.style.font = '14px sans-serif'
    this.date.style.whiteSpace = 'nowrap'
    this.date.style.color = '#222222'

    this.bottomWrapper = document.createElement('div')
    this.bottomWrapper.style.display = 'flex'

    this.circles = document.createElement('div')

    lines.forEach((line) => {
      const el = document.createElement('div')
      el.style.display = 'flex'
      el.style.flexDirection = 'column'
      el.style.marginRight = '18px'
      el.style.color = line.color

      const num = document.createElement('div')
      const name = document.createElement('div')
      const circle = document.createElement('div')

      name.innerHTML = line.name

      num.style.font = '14px sans-serif'
      num.style.fontWeight = 600
      num.style.marginBottom = 600

      name.style.font = '12px sans-serif'

      circle.style.position = 'absolute'
      circle.style.width = '10px'
      circle.style.height = '10px'
      circle.style.transform = 'translateX(-50%)'
      circle.border = 'solid 2px'
      circle.backgroundColor = '#fff'
      circle.borderRadius = '5px'
      circle.borderColor = line.color

      el.appendChild(num)
      el.appendChild(name)
      this.bottomWrapper.appendChild(el)
      this.circles.appendChild(circle)
    })

    this.bottomWrapper.children[this.bottomWrapper.children.length - 1].marginRight = '0px'

    this.line = document.createElement('div')
    this.line.style.position = 'absolute'
    this.line.style.zIndex = '-1'
    this.line.style.height = '100%'
    this.line.style.width = '1px'
    this.line.style.backgroundColor = '#DFE6EB'

    this.wrapper.appendChild(this.date)
    this.wrapper.appendChild(this.bottomWrapper)
    this.el.appendChild(this.wrapper)
    this.el.appendChild(this.line)
    this.el.appendChild(this.circles)
  }

  draw (values, offsetX, scaleY) {
    this.el.style.opacity = 1

    values.forEach((val, id) => {
      const num = this.bottomWrapper.children[id].children[0]
      const circle = this.circles.children[id]

      num.innerHTML = val.y
      circle.style.bottom = `${val.y * scaleY}px`

      console.log('scaleY', scaleY);
      console.log('val.y * scaleY', val.y * scaleY);
    })

    this.el.style.left = `${offsetX}px`
  }

  hide () {
    this.el.style.opacity = 0
  }
}
