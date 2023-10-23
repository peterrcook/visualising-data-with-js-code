import { tidy, count, filter } from '@tidyjs/tidy';
import Chart from 'chart.js/auto';
import uniq from 'lodash-es/uniq';

import './style.css';

Chart.defaults.plugins.legend.display = false;
Chart.defaults.scale.title.font = {size: 14};
Chart.defaults.plugins.title.display = true;
Chart.defaults.plugins.title.font.size = 18;
Chart.defaults.maintainAspectRatio = false;

const technologyPalette = {
  'Advanced Conversion Technologies': '#FF9999',
  'Anaerobic Digestion': '#C58882',
  'Battery': '#B6A6CA',
  'Biomass (co-firing)': '#50723C',
  'Biomass (dedicated)': '#50723C',
  'EfW Incineration': '#B56B45',
  'Large Hydro': '#469B77',
  'Small Hydro': '#469B77',
  'Wind Onshore': '#6D98BA',
  'Wind Offshore': '#6D98BA',
  'Solar Photovoltaics': '#EEC170',
  'Landfill Gas': '#AF4319'
};

function getMultiSeriesChartData(data, seriesProp, labelProp) {
  // Given an array of data, the series property name (e.g. 'technology') and the label property name (e.g. 'year')
  // create a data object in Chart.js's required format:
  //
  // {
  //   labels: ['label-1', 'label-2', ...],
  //   datasets: [
  //     {
  //       label: 'series-1',
  //       data: [value-1, value-2, ...]
  //     }
  //     ...
  //   ]
  // }

  let seriesNames = uniq(data.map(d => d[seriesProp]))
      .filter(d => d !== '')
      .sort();

  let labelNames = uniq(data.map(d => d[labelProp]))
      .filter(d => d !== '')
      .sort();

  let chartData = {
    labels: labelNames,
    datasets: seriesNames.map(series => {
      return {
        label: series,
        data: []
      };
    })
  };

  // Add data to each series
  chartData.datasets.forEach(series => {
    series.data = labelNames.map(label => {
      let items = data.filter(d => {
        return d[seriesProp] === series.label && d[labelProp] === label;
      });
      return items.length;
    });
  });

  return chartData;
}

function drawChart1(data) {
  let summary = tidy(
    data,
    count('technology', {sort: true})
  );
  
  const myChart = new Chart('chart-1', {
    type: 'bar',
    data: {
      labels: summary.map(d => d.technology),
      datasets: [{
        data: summary.map(d => d.n),
        backgroundColor: '#19A0AA'
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          title: {
            display: true,
            text: 'Number of applications'
          }
        }
      },
      plugins: {
        title: {
          text: 'Number of planning applications (by technology) 1990-2022',
        }
      }
    }
  });
}

function drawChart2(data) {
  let summary = tidy(
    data,
    count('technology', {sort: true})
  );
  
  const myChart = new Chart('chart-2', {
    type: 'bar',
    data: {
      labels: summary.map(d => d.technology),
      datasets: [{
        data: summary.map(d => d.n),
        backgroundColor: '#19A0AA'
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          title: {
            display: true,
            text: 'Number of applications',
            color: '#eee'
          },
          ticks: {
            color: '#ccc'
          },
          grid: {
            color: '#555'
          }
        },
        y: {
          ticks: {
            color: '#ccc'
          },
          grid: {
            color: '#333'
          }
        }
      },
      plugins: {
        title: {
          text: 'Number of planning applications (by technology) 1990-2022',
          color: '#ccc'
        }
      }
    }
  });
}

function drawChart3(data) {
  let chartData = getMultiSeriesChartData(data, 'technology', 'yearSubmitted');

  // Add style to each series
  chartData.datasets.forEach(series => {
    let color = technologyPalette[series.label] || '#aaa';
    series.borderColor = color;
    series.borderWidth = 1.5;
    series.backgroundColor = color;
    series.radius = 2;
  });

  const myChart = new Chart('chart-3', {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of applications'
          }
        }
      },
      plugins: {
        title: {
          text: 'Number of applications (by technology) 1990-2022',
        },
        legend: {
          display: true
        }
      }
    }
  });
}

function drawChart4(data) {
  let chartData = getMultiSeriesChartData(data, 'technology', 'region');

  // Add colour to each series
  chartData.datasets.forEach(series => {
    let color = technologyPalette[series.label] || '#aaa';
    series.backgroundColor = color;
  });

  const myChart = new Chart('chart-4', {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Number of applications'
          }
        }
      },
      plugins: {
        title: {
          text: 'Number of applications (by region and technology) 1990-2022',
        },
        legend: {
          display: true
        }
      }
    }
  });
}

function draw(data) {
  drawChart1(data);
  drawChart2(data);
  drawChart3(data);
  drawChart4(data);
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => draw(data));
