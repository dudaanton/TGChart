import check from '@/icons/check.svg'

const ns = 'http://www.w3.org/2000/svg'

export default class Checkbox {
  constructor (color, name, checked = true, cb) {
    this.el = document.createElement('div')
    this.el.style.padding = '4px 8px 4px 4px'
    this.el.style.height = '24px'
    this.el.style.position = 'relative'
    this.el.style.display = 'inline-flex'
    this.el.style.alignItems = 'center'
    this.el.style.boxSizing = 'border-box'
    this.el.style.border = 'solid #DDEAF3 1px'
    this.el.style.borderRadius = '12px'
    this.el.style.cursor = 'pointer'

    this.button = document.createElement('div')
    this.button.style.height = '16px'
    this.button.style.width = '16px'
    this.button.style.display = 'flex'
    this.button.style.alignItems = 'center'
    this.button.style.justifyContent = 'center'
    this.button.style.boxSizing = 'border-box'
    this.button.style.marginRight = '8px'
    this.button.style.backgroundColor = (checked) ? color : '#fff'
    this.button.style.border = `solid ${color} 2px`
    this.button.style.borderRadius = '8px'
    this.button.innerHTML = check
    const icon = this.button.children[0]
    console.log('this.button', this.button);
    icon.style.width = '8px'
    icon.style.fill = '#fff'

    this.text = document.createElement('div')
    this.text.style.font = '12px sans-serif'
    this.text.style.textTransform = 'capitalize'
    this.text.style.color = '#43484B'
    this.text.innerHTML = name

    this.el.appendChild(this.button)
    this.el.appendChild(this.text)

    this.el.onclick = (e) => {
      cb(!checked)
    }
  }
}
