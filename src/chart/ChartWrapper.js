import Chart from '@/chart/Chart'
import Grid from '@/chart/Grid'
import Navigation from '@/chart/Navigation'
import Checkbox from '@/chart/Checkbox'

import getChartData from '@/helpers/getChartData'

function createNavWrap () {
  const navigationWrapper = document.createElement('div')
  navigationWrapper.style.height = '52px'
  navigationWrapper.style.position = 'relative'
  navigationWrapper.style.marginTop = '32px'

  return navigationWrapper
}

function createChartWrap () {
  const chartWrapper = document.createElement('div')
  chartWrapper.style.height = '100%'
  chartWrapper.style.position = 'relative'
  // chartWrapper.style.overflow = 'hidden'
  // chartWrapper.style.border = 'solid 1px #aaa'

  return chartWrapper
}

function createHeader () {
  const header = document.createElement('div')
  header.style.font = '18px sans-serif'
  header.style.fontWeight = '600'
  header.style.color = '#222222'
  header.style.margin = '0 0 24px 4px'
  header.style.transition = 'color 0.1s ease-out'
  header.innerHTML = 'Followers'

  return header
}

export default class ChartWrapper {
  constructor (data) {
    this.el = document.createElement('div')
    this.el.style.width = '100%'
    // this.el.style.height = '300px'
    this.el.style.position = 'relative'
    this.el.style.boxSizing = 'border-box'
    this.el.style.padding = '24px 8px 8px'
    // this.el.style.overflowX = 'hidden'
    this.data = getChartData(data)

    this.chartWrapper = createChartWrap()
    this.navigationWrapper = createNavWrap()
    this.header = createHeader()
    this.el.appendChild(this.header)
    this.el.appendChild(this.chartWrapper)
    this.el.appendChild(this.navigationWrapper)

    this.chart = new Chart('100%', '300px')
    this.chart.el.style.zIndex = 1
    this.grid = new Grid('100%', '300px')
    this.navigation = new Navigation(this.changeViewbox.bind(this))

    this.chartWrapper.appendChild(this.chart.el)
    this.chartWrapper.appendChild(this.grid.el)
    this.navigationWrapper.appendChild(this.navigation.el)


    // const lines = Object.keys(data.names).map((line) => {
    //   return {
    //     id: line,
    //     name: data.names[line],
    //     color: data.names[line],
    //   }
    // })

    this.checkboxes = []

    this.data.lines.forEach((line) => {
      const checkbox = new Checkbox({
        color: line.color,
        name: line.name,
        id: line.id
      }, true, this.changeLineView.bind(this))

      checkbox.el.style.margin = '12px 12px 0 0'

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
    this.header.style.color = (day) ? '#222222' : '#fff'

    // this.chart.swithTheme(day)
    this.checkboxes.forEach(c => c.swithTheme(day))
    this.navigation.swithTheme(day)
    this.grid.swithTheme(day)
  }
}
