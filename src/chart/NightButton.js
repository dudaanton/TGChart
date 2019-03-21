export default class Checkbox {
  constructor (cb) {
    this.day = true

    this.el = document.createElement('div')
    this.el.classList.add('tgc-night-button')
    this.el.innerHTML = 'Swith to Night Mode'

    this.el.onclick = (e) => {
      cb(!this.day)
      this.day = !this.day
      this.el.innerHTML = `Swith to ${(this.day) ? 'Night' : 'Day'} Mode`
    }
  }
}
