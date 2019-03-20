export default class Checkbox {
  constructor (cb) {
    this.day = true

    this.el = document.createElement('div')
    this.el.style.font = '18px sans-serif'
    this.el.style.fontWeight = '300'
    this.el.style.color = '#0F8BE3'
    this.el.style.cursor = 'pointer'
    this.el.innerHTML = 'Swith to Night Mode'

    this.el.onclick = (e) => {
      cb(!this.day)
      this.day = !this.day
      this.el.innerHTML = `Swith to ${(this.day) ? 'Night' : 'Day'} Mode`
    }
  }
}
