import ChartWrapper from '@/chart/ChartWrapper'
import data from '@/data'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  document.body.style.margin = '0px'

  root.style.width = '100%'
  root.style.height = '100%'

  const chart = new ChartWrapper(data[3])

  root.appendChild(chart.el)
})
