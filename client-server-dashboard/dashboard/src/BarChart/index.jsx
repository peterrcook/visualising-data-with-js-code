import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function BarChart(props) {
  const containerEl = useRef();
  const myChart = useRef();

  function initChart() {
    if(myChart.current) return;

    myChart.current = new Chart(containerEl.current, {
      type: 'bar',
      data: {
        labels: props.data.map(d => d.name),
        datasets: [
          {
            maxBarThickness: 40,
            data: []
          }
        ]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        scales: {
          x: {
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

    let colors = props.data.map(d => props.colorScale ? props.colorScale(d.name) : '#aaa');
    myChart.current.data.datasets[0].backgroundColor = colors;

    myChart.current.update();
  }
  
  useEffect(() => {
    initChart();
    updateChart();
  });

  return (
    <div className="chart-wrapper">
      <h4>{props.title}</h4>
      <div className="chart">
        <canvas ref={containerEl}></canvas>
      </div>
    </div>
  );
}

export default BarChart;
