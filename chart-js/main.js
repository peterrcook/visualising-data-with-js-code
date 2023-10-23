import { tidy, count } from '@tidyjs/tidy';
import Chart from 'chart.js/auto';

function draw(data) {
  let summary = tidy(
    data,
    count('technology', {sort: true})
  );

  const myChart = new Chart('chart', {
    type: 'bar',
    data: {
      labels: summary.map(d => d.technology),
      datasets: [{
        data: summary.map(d => d.n)
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Number of planning submissions (by technology) 1990-2022',
          font: {
            size: 18
          }
        },
        legend: {
          display: false
        }
      }
    }
  });
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => draw(data));
