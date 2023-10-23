import { tidy, count, filter, sort, desc, groupBy, summarize, mean } from '@tidyjs/tidy';
import Chart from 'chart.js/auto';
import L from 'leaflet';
import uniq from 'lodash-es/uniq';
import { min, max } from 'd3-array';
import { scaleSqrt } from 'd3-scale';

import './style.css';

Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.scale.title.font = {size: 16};
Chart.defaults.plugins.title.display = true;
Chart.defaults.plugins.title.font.size = 20;

let grey = '#999';
let lightGrey = '#CCC';
let yellow = '#F5CF29';
let teal = '#19A0AA';

let statusPalette = {
  'Operational': teal,
  'Application Withdrawn': lightGrey,
  'Application Refused': lightGrey,
  'Abandoned': lightGrey,
  'Planning Permission Expired': lightGrey,
  'Under Construction': yellow,
  'Awaiting Construction': yellow,
  'Decommissioned': lightGrey,
  'Application Submitted': grey,
  'Appeal Lodged': grey,
  'Appeal Withdrawn': lightGrey,
  'No Application Required': yellow,
  'Revised': grey
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
        backgroundColor: summary.map(d => d.technology === 'Battery' ? teal : '#999')
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
  let chartData = getMultiSeriesChartData(data, 'technology', 'yearSubmitted');

  // Add style to each series
  chartData.datasets.forEach(series => {
    let color = series.label === 'Battery' ? teal : '#999';
    series.backgroundColor = color;
    series.radius = 2;
    series.borderColor = color;
    series.borderWidth = 1.5;
    series.borderDash = series.label === 'Battery' ? [] : [1,1];
  });

  const myChart = new Chart('chart-2', {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year',
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
          title: {
            display: true,
            text: 'Number of applications',
            color: '#eee'
          },
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
          text: 'Battery applications compared with other renewables 1990-2022',
          color: '#eee'
        },
        legend: {
          display: false
        }
      }
    }
  });
}

function getMapTooltipContent(d) {
  var content = '';
  content += '<h4>' + d.name + '</h4>';
  content += '<div>Technology: ' + d.technology + '</div>';
  content += '<div>Capacity: ' + (d.capacity ? d.capacity + 'Mw' : 'Unknown ') + '</div>';
  content += '<div>Operator: ' + d.operator + '</div>';
  content += '<div>Status: ' + d.status + '</div>';
  return content;
}

function drawMap(data) {
  let filteredData = tidy(
    data,
    filter(d => d.technology === 'Battery'),
    sort(desc('capacity'))
  );

  let map = L.map('map', {
    scrollWheelZoom: false
  });

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.setView([55, -2], 6);

  let maxCapacity = max(filteredData, d => d.capacity);
  let maxRadius = 30;
  let radiusScale = scaleSqrt().domain([0, maxCapacity]).range([5, maxRadius]);

  filteredData.forEach(d => {
    if (d.lat === null || d.lon === null) return;
    let marker = L.circleMarker([d.lat, d.lon]);
    let radius = radiusScale(d.capacity || 0);
    let color = statusPalette[d.status] || '#aaa';
    
    marker.setStyle({
      radius: radius,
      fillColor: color,
      fillOpacity: 0.75,
      weight: 1,
      opacity : 1,
      color: color
    });

    marker.bindTooltip(getMapTooltipContent(d));
    marker.addTo(map);
  });
}

function drawChart3(data) {
  let summary = tidy(
    data,
    filter(d => d.technology === 'Battery'),
    count('status', {sort: true})
  );

  const myChart = new Chart('chart-3', {
    type: 'doughnut',
    data: {
      labels: summary.map(d => d.status),
      datasets: [{
        data: summary.map(d => d.n),
        backgroundColor: summary.map(d => statusPalette[d.status])
      }],
    },
    options: {
      plugins: {
        title: {
          text: 'Status of battery planning applications in 2022',
        },
        legend: {
          display: true
        }
      }
    }
  });
}

function drawChart4(data) {
  let summary = tidy(
    data,
    filter(d => d.daysUntilGranted !== null),
    groupBy('technology', [
      summarize({
        meanDaysUntilGranted: mean('daysUntilGranted')
      })
    ]),
    sort('meanDaysUntilGranted')
  );

  window.summary = summary

  const myChart = new Chart('chart-4', {
    type: 'bar',
    data: {
      labels: summary.map(d => d.technology),
      datasets: [{
        data: summary.map(d => d.meanDaysUntilGranted),
        backgroundColor: summary.map(d => d.technology === 'Battery' ? teal: '#777')
      }]
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Days until application granted',
            color: '#eee'
          },
          ticks: {
            color: '#ccc'
          },
          grid: {
            color: '#555'
          }
        },
        x: {
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
          text: 'Average time to grant applications (by technology) 1990-2022',
          color: '#eee'
        }
      }
    }
  });
}

function draw(data) {
  drawChart1(data);
  drawChart2(data);
  drawMap(data);
  drawChart3(data);
  drawChart4(data);
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => draw(data));
