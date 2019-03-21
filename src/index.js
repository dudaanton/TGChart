import ChartWrapper from '@/chart/ChartWrapper'
import NightButton from '@/chart/NightButton'

// import data from '@/data'

const initChart = (data) => {
  const root = document.getElementById('root')
  const chart1 = new ChartWrapper(data[0], 'Chart #1')
  const chart2 = new ChartWrapper(data[1], 'Chart #2')
  const chart3 = new ChartWrapper(data[2], 'Chart #3')
  const chart4 = new ChartWrapper(data[3], 'Chart #4')
  const chart5 = new ChartWrapper(data[4], 'Chart #5')

  const swithTheme = (day) => {
    if (day) {
      document.body.classList.remove('night')
    } else {
      document.body.classList.add('night')
    }

    chart1.swithTheme(day)
    chart2.swithTheme(day)
    chart3.swithTheme(day)
    chart4.swithTheme(day)
    chart5.swithTheme(day)
  }

  const nightButton = new NightButton(swithTheme)

  root.appendChild(chart1.el)
  root.appendChild(chart2.el)
  root.appendChild(chart3.el)
  root.appendChild(chart4.el)
  root.appendChild(chart5.el)
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
