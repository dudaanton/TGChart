import Chart from '@/chart/Chart'
import Navigation from '@/chart/Navigation'
import Checkbox from '@/chart/Checkbox'

import getChartData from '@/helpers/getChartData'

function createNavWrap () {
  const navigationWrapper = document.createElement('div')
  navigationWrapper.style.height = '52px'
  navigationWrapper.style.position = 'relative'
  navigationWrapper.style.marginTop = '18px'

  return navigationWrapper
}

function createChartWrap () {
  const chartWrapper = document.createElement('div')
  chartWrapper.style.height = '100%'
  chartWrapper.style.position = 'relative'
  chartWrapper.style.overflow = 'hidden'
  chartWrapper.style.border = 'solid 1px #aaa'

  return chartWrapper
}

export default class ChartWrapper {
  constructor (data) {
    this.el = document.createElement('div')
    this.el.style.width = '375px'
    this.el.style.height = '300px'
    this.el.style.position = 'relative'
    this.el.style.padding = '8px'
    this.data = getChartData(data)

    this.chartWrapper = createChartWrap()
    this.navigationWrapper = createNavWrap()
    this.el.appendChild(this.chartWrapper)
    this.el.appendChild(this.navigationWrapper)

    this.chart = new Chart('100%', '100%')
    this.navigation = new Navigation(this.changeViewbox.bind(this))

    this.chartWrapper.appendChild(this.chart.el)
    this.navigationWrapper.appendChild(this.navigation.el)


    // const lines = Object.keys(data.names).map((line) => {
    //   return {
    //     id: line,
    //     name: data.names[line],
    //     color: data.names[line],
    //   }
    // })

    this.data.lines.forEach((line) => {
      this.checkbox = new Checkbox({
        color: line.color,
        name: line.name,
        id: line.id
      }, true, this.changeLineView.bind(this))

      this.checkbox.el.style.margin = '12px 12px 0 0'

      this.navigationWrapper.appendChild(this.checkbox.el)
    })

    setTimeout(() => {
      this.chart.draw(this.data)
      this.navigation.draw(this.data)
    })
  }

  changeViewbox (coords) {
    this.chart.changeViewbox(coords)
  }

  changeLineView (line, view) {
    this.chart.changeLineView(line, view)
    this.navigation.changeLineView(line, view)
  }
}
