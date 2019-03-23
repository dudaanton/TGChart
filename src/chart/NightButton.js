export default class Checkbox {
  constructor (cb) {
    this.day = true

    this.el = document.createElement('div')
    this.el.classList.add('tgc-night-button')
    this.el.innerHTML = 'Switch to Night Mode'

    this.el.onclick = (e) => {
      cb(!this.day)
      this.day = !this.day
      this.el.innerHTML = `Switch to ${(this.day) ? 'Night' : 'Day'} Mode`
    }
  }
}
