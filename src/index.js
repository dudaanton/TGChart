import ChartWrapper from '@/chart/ChartWrapper'
import NightButton from '@/chart/NightButton'
import data from '@/data'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  document.body.style.margin = '0px'
  document.body.style.transition = 'background-color 0.1s ease-out'
  document.body.style.overflowX = 'hidden'

  root.style.width = '375px'
  root.style.height = '100vh'
  root.style.position = 'relative'

  const chart = new ChartWrapper(data[0])

  const swithTheme = (day) => {
    document.body.style.backgroundColor = (day) ? '#fff' : '#242F3E'
    chart.swithTheme(day)
  }

  const nightButton = new NightButton(swithTheme)
  nightButton.el.style.position = 'absolute'
  nightButton.el.style.bottom = '32px'
  nightButton.el.style.left = '50%'
  nightButton.el.style.transform = 'translate(-50%, 0)'

  root.appendChild(chart.el)
  root.appendChild(nightButton.el)
})
