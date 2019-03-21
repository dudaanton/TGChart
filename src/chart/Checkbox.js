import check from '@/icons/check.svg'

export default class Checkbox {
  constructor (line, checked = true, cb) {
    this.checked = checked
    this.id = line.id

    this.el = document.createElement('div')
    this.el.className = 'tgc-checkbox'

    this.button = document.createElement('div')
    this.button.className = 'tgc-checkbox__button'
    this.button.style.backgroundColor = (checked) ? line.color : 'rgba(0, 0, 0, 0)'
    this.button.style.borderColor = line.color
    this.button.innerHTML = check

    this.text = document.createElement('div')
    this.text.className = 'tgc-checkbox__text'
    this.text.innerHTML = line.name

    this.el.appendChild(this.button)
    this.el.appendChild(this.text)

    this.el.onclick = (e) => {
      cb(this.id, !this.checked)
      this.checked = !this.checked
      this.button.style.backgroundColor = (this.checked) ? line.color : 'rgba(0, 0, 0, 0)'
      if (this.checked) {
        this.button.style.backgroundColor = line.color
        this.button.classList.remove('tgc-checkbox__button_unchecked')
      } else {
        this.button.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        this.button.classList.add('tgc-checkbox__button_unchecked')
      }
    }
  }

  swithTheme (day) {
    if (day) {
      this.el.classList.remove('night')
    } else {
      this.el.classList.add('night')
    }
  }
}
