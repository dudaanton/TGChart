export default class Line {
  constructor (text, day = true) {
    this.el = document.createElement('div')
    this.el.classList.add('tgc-grid__line-wrapper')

    this.line = document.createElement('div')
    this.line.classList.add('tgc-grid__line')

    this.text = document.createElement('div')
    this.text.classList.add('tgc-grid__line-text')
    this.text.innerHTML = text

    this.el.appendChild(this.line)
    this.el.appendChild(this.text)
  }

  swithTheme (day) {
    if (day) {
      this.line.classList.remove('night')
      this.text.classList.remove('night')
    } else {
      this.line.classList.add('night')
      this.text.classList.add('night')
    }
  }
}
