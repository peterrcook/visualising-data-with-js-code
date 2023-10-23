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
            data: []
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
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
    <div className="chart">
      <canvas ref={containerEl}></canvas>
    </div>
  );
}

export default BarChart;
