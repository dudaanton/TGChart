const ns = 'http://www.w3.org/2000/svg'

export default class Line {
  constructor (text, day = true) {
    this.el = document.createElement('div')
    this.el.style.position = 'absolute'
    this.el.style.width = '100%'

    this.line = document.createElement('div')
    this.line.style.width = '100%'
    this.line.style.height = '1px'
    this.line.style.backgroundColor = (day) ? '#F2F4F5' : '#3B4A5A'

    this.text = document.createElement('div')
    this.text.innerHTML = text
    this.text.style.position = 'absolute'
    this.text.style.top = '-16px'
    this.text.style.zIndex = '2'
    this.text.style.font = '10px sans-serif'
    this.text.style.fontWeight = '300'
    this.text.style.color = (day) ? '#98A3AC' : '#526677'

    this.el.appendChild(this.line)
    this.el.appendChild(this.text)
  }

  swithTheme (day) {
    this.line.style.backgroundColor = (day) ? '#F2F4F5' : '#3B4A5A'
    this.text.style.color = (day) ? '#98A3AC' : '#526677'
  }
}
