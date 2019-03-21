import getDate from '@/helpers/getDate'

export default class InfoBlock {
  constructor (lines) {
    this.day = true

    this.el = document.createElement('div')
    this.el.className = 'tgc-info-block'

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'tgc-info-block__wrapper'

    this.date = document.createElement('div')
    this.date.className = 'tgc-info-block__date'

    this.bottomWrapper = document.createElement('div')
    this.bottomWrapper.className = 'tgc-info-block__bottom-wrapper'

    this.circles = document.createElement('div')
    this.circles.className = 'tgc-info-block__circles'

    this.applyData(lines)

    this.line = document.createElement('div')
    this.line.className = 'tgc-info-block__line'

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
      el.className = 'tgc-info-block__description'
      el.style.color = line.color

      const num = document.createElement('div')
      const name = document.createElement('div')
      const circle = document.createElement('div')
      num.className = 'tgc-info-block__number'
      name.className = 'tgc-info-block__name'
      circle.className = 'tgc-info-block__circle'

      name.innerHTML = line.name

      circle.style.borderColor = line.color

      el.appendChild(num)
      el.appendChild(name)
      this.bottomWrapper.appendChild(el)
      this.circles.appendChild(circle)
    })
  }

  draw (values, x, offsetX, maxOffsetX, scaleY) {
    this.el.style.opacity = 1

    this.date.innerHTML = getDate(x, true)

    values.forEach((val, id) => {
      const num = this.bottomWrapper.children[id].children[0]
      const circle = this.circles.children[id]

      num.innerHTML = val
      circle.style.bottom = `${val * scaleY}px`
    })

    this.el.style.left = `${offsetX}px`

    const wrapperWidth = this.wrapper.offsetWidth

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

    if (day) {
      this.el.classList.remove('night')
    } else {
      this.el.classList.add('night')
    }
  }
}
