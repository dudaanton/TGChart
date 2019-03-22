import ChartWrapper from '@/chart/ChartWrapper'
import NightButton from '@/chart/NightButton'

// import data from '@/data'

const initChart = (data) => {
  const root = document.getElementById('root')
  const charts = []

  data.forEach((chart, id) => {
    const chartW = new ChartWrapper(chart, `Chart #${id + 1}`)
    root.appendChild(chartW.el)
    charts.push(chartW)
  })

  const swithTheme = (day) => {
    if (day) {
      document.body.classList.remove('night')
    } else {
      document.body.classList.add('night')
    }

    charts.forEach(chart => chart.swithTheme(day))
  }

  const nightButton = new NightButton(swithTheme)

  root.appendChild(nightButton.el)
}

document.addEventListener('DOMContentLoaded', () => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://raw.githubusercontent.com/dudaanton/t-data/master/data.json', true);

  xhr.send()

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) return

    if (xhr.status !== 200) {
      console.error('Error while loading data')
    } else {
      const data = JSON.parse(xhr.responseText)
      initChart(data)
    }
  }
})
