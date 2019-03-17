import check from '@/icons/check.svg'

const ns = 'http://www.w3.org/2000/svg'

export default class Checkbox {
  constructor (line, checked = true, cb) {
    this.checked = checked
    this.id = line.id

    this.el = document.createElement('div')
    this.el.style.padding = '6px 12px 6px 6px'
    this.el.style.height = '30px'
    this.el.style.position = 'relative'
    this.el.style.display = 'inline-flex'
    this.el.style.alignItems = 'center'
    this.el.style.boxSizing = 'border-box'
    this.el.style.border = 'solid #DDEAF3 1px'
    this.el.style.borderRadius = '20px'
    this.el.style.cursor = 'pointer'

    this.button = document.createElement('div')
    this.button.style.height = '20px'
    this.button.style.width = '20px'
    this.button.style.display = 'flex'
    this.button.style.alignItems = 'center'
    this.button.style.justifyContent = 'center'
    this.button.style.boxSizing = 'border-box'
    this.button.style.marginRight = '12px'
    this.button.style.backgroundColor = (checked) ? line.color : '#fff'
    this.button.style.border = `solid ${line.color} 2px`
    this.button.style.borderRadius = '10px'
    this.button.style.transition = 'background-color 0.3s ease-out'
    this.button.innerHTML = check
    const icon = this.button.children[0]
    icon.style.width = '10px'
    icon.style.fill = '#fff'

    this.text = document.createElement('div')
    this.text.style.font = '12px sans-serif'
    this.text.style.textTransform = 'capitalize'
    this.text.style.color = '#43484B'
    this.text.innerHTML = line.name

    this.el.appendChild(this.button)
    this.el.appendChild(this.text)

    this.el.onclick = (e) => {
      cb(this.id, !this.checked)
      this.checked = !this.checked
      this.button.style.backgroundColor = (this.checked) ? line.color : '#fff'
    }
  }
}
