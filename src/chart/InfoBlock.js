import getDate from '@/helpers/getDate'

export default class InfoBlock {
  constructor (lines, day) {
    this.day = true

    this.el = document.createElement('div')
    this.el.style.position = 'absolute'
    // this.el.className = 'infoBlock'
    this.el.style.height = '100%'
    this.el.style.opacity = 0
    this.el.style.transition = 'opacity 0.3s ease-out'

    this.wrapper = document.createElement('div')
    this.wrapper.style.position = 'absolute'
    this.wrapper.style.top = 0
    this.wrapper.style.left = '-32px'
    this.wrapper.style.zIndex = 3
    // this.wrapper.style.transform = 'translate(-30%, -30%)'
    this.wrapper.style.padding = '8px 14px 8px 10px'
    this.wrapper.style.maxWidth = '100vw'
    this.wrapper.style.borderRadius = '4px'
    this.wrapper.style.backgroundColor = '#fff'
    this.wrapper.style.boxShadow = '0px 0.3px 1px 0.3px #DBDBDB, 0px 0.5px 1px 0.3px #DBDBDB'

    this.date = document.createElement('div')
    // this.date.innerHTML = 'Sat, Feb 24'
    this.date.style.marginBottom = '14px'
    this.date.style.font = '14px sans-serif'
    this.date.style.whiteSpace = 'nowrap'
    this.date.style.color = '#222222'

    this.bottomWrapper = document.createElement('div')
    this.bottomWrapper.style.display = 'flex'

    this.circles = document.createElement('div')

    this.applyData(lines)

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

  applyData (lines) {
    this.bottomWrapper.innerHTML = ''
    this.circles.innerHTML = ''

    lines.forEach((line) => {
      if (!line.visible) return

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
      circle.style.width = '6px'
      circle.style.height = '6px'
      circle.style.transform = 'translate(-50%, 50%)'
      circle.style.border = 'solid 2px'
      circle.style.backgroundColor = (this.day) ? '#fff' : '#243241'
      circle.style.borderRadius = '5px'
      circle.style.borderColor = line.color

      el.appendChild(num)
      el.appendChild(name)
      this.bottomWrapper.appendChild(el)
      this.circles.appendChild(circle)
    })

    if (this.bottomWrapper.children.length) {
      this.bottomWrapper.children[this.bottomWrapper.children.length - 1].style.marginRight = '0px'
    }
  }

  draw (values, x, offsetX, maxOffsetX, scaleY) {
    this.el.style.opacity = 1

    this.date.innerHTML = getDate(x, true)

    values.forEach((val, id) => {
      const num = this.bottomWrapper.children[id].children[0]
      const circle = this.circles.children[id]

      num.innerHTML = val
      circle.style.bottom = `${val * scaleY}px`

      circle.className = 'circle'
    })

    this.el.style.left = `${offsetX}px`

    const wrapperLeft = this.wrapper.getBoundingClientRect().left
    const wrapperRight = this.wrapper.getBoundingClientRect().right
    const wrapperWidth = this.wrapper.offsetWidth

    // console.log('wrapperRight', wrapperRight);
    // console.log('window.pageXOffset', window.innerWidth);

    if (offsetX < 32) {
      this.wrapper.style.left = `${-offsetX}px`
    } else if (offsetX + wrapperWidth - 32 > maxOffsetX) {
      this.wrapper.style.left = `${maxOffsetX - offsetX - wrapperWidth}px`
    } else {
      this.wrapper.style.left = '-32px'
    }
  }

  hide () {
    this.el.style.opacity = 0
  }

  swithTheme (day) {
    this.day = day
    this.wrapper.style.backgroundColor = (day) ? '#fff' : '#243241'
    this.line.style.backgroundColor = (day) ? '#DFE6EB' : '#3B4A5A'
    this.date.style.color = (day) ? '#222222' : '#FCFCFC'
    this.wrapper.style.boxShadow = `0px 0.3px 1px 0.3px ${(day) ? '#DBDBDB' : '#1E2834'}, 0px 0.3px 1px 0.3px ${(day) ? '#DBDBDB' : '#1E2834'}`;
    [...this.circles.children].forEach((circle) => {
      circle.style.backgroundColor = (day) ? '#fff' : '#243241'
    })
  }
}
