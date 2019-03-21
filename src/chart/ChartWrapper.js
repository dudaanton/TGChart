import Chart from '@/chart/Chart'
import Grid from '@/chart/Grid'
import Navigation from '@/chart/Navigation'
import Checkbox from '@/chart/Checkbox'

import getChartData from '@/helpers/getChartData'

export default class ChartWrapper {
  constructor (data) {
    this.el = document.createElement('div')
    this.el.className = 'tgc-chart-wrapper'
    this.data = getChartData(data)

    this.chartWrapper = document.createElement('div')
    this.chartWrapper.className = 'tgc-chart-wrapper__wrapper'

    this.navigationWrapper = document.createElement('div')
    this.navigationWrapper.className = 'tgc-chart-wrapper__nav-wrapper'

    this.header = document.createElement('div')
    this.header.className = 'tgc-chart-wrapper__header'
    this.header.innerHTML = 'Followers'

    this.el.appendChild(this.header)
    this.el.appendChild(this.chartWrapper)
    this.el.appendChild(this.navigationWrapper)

    this.chart = new Chart('100%', '300px')
    this.chart.el.classList.add('tgc-chart_big')
    this.grid = new Grid()
    this.navigation = new Navigation(this.changeViewbox.bind(this))

    this.chartWrapper.appendChild(this.chart.el)
    this.chartWrapper.appendChild(this.grid.el)
    this.navigationWrapper.appendChild(this.navigation.el)

    this.checkboxes = []

    this.data.lines.forEach((line) => {
      const checkbox = new Checkbox({
        color: line.color,
        name: line.name,
        id: line.id
      }, true, this.changeLineView.bind(this))

      this.el.appendChild(checkbox.el)
      this.checkboxes.push(checkbox)
    })

    setTimeout(() => {
      this.chart.draw(this.data, {}, true)
      this.grid.draw(this.data)
      this.navigation.draw(this.data)
    })
  }

  changeViewbox (coords) {
    this.chart.changeViewbox(coords, 120, this.changeGrid.bind(this))
  }

  changeGrid (data) {
    this.grid.changeGrid(data)
  }

  changeLineView (line, view) {
    this.chart.changeLineView(line, view, this.changeGrid.bind(this))
    this.navigation.changeLineView(line, view)
  }

  swithTheme (day) {
    if (day) {
      this.header.classList.remove('night')
    } else {
      this.header.classList.add('night')
    }

    this.chart.swithTheme(day)
    this.checkboxes.forEach(c => c.swithTheme(day))
    this.navigation.swithTheme(day)
    this.grid.swithTheme(day)
  }
}
