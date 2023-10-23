import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

import './style.css';

function LineChart(props) {
  const containerEl = useRef();
  const myChart = useRef();

  function initChart() {
    if(myChart.current) return;

    myChart.current = new Chart(containerEl.current, {
      type: 'line',
      data: {
        labels: props.data.map(d => d.name),
        datasets: [
          {
            data: []
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Number of applications',
              color: '#777',
              font: {
                size: 14
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  function updateChart() {
    myChart.current.data.labels = props.data.map(d => d.name);
    myChart.current.data.datasets[0].data = props.data.map(d => d.n);

    myChart.current.update();
  }
  
  useEffect(() => {
    initChart();
    updateChart();
  });
  
  return (
    <div className="chart-wrapper line-chart">
      <h4>{props.title}</h4>
      <div className="chart">
        <canvas ref={containerEl}></canvas>
      </div>
    </div>
  );
}

export default LineChart;
