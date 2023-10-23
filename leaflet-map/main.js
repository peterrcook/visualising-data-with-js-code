import L from 'leaflet';
import { scaleSqrt } from 'd3-scale';
import { max } from 'd3-array';

import './style.css';

const technologyColors = {
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

function getTooltipContent(d) {
  var content = '';
  content += '<h4>' + d.name + '</h4>';
  content += '<div>Technology: ' + d.technology + '</div>';
  content += '<div>Capacity: ' + (d.capacity ? d.capacity + 'Mw' : 'Unknown ') + '</div>';
  content += '<div>Operator: ' + d.operator + '</div>';
  content += '<div>Status: ' + d.status + '</div>';
  return content;
}

function draw(data) {
  let map = L.map('map');

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.setView([55, -2], 6);

  let maxCapacity = max(data, d => d.capacity);
  let maxRadius = 20;
  let radiusScale = scaleSqrt().domain([0, maxCapacity]).range([3, maxRadius]);

  data.forEach(d => {
    if (d.lat === null || d.lon === null) return;
    let marker = L.circleMarker([d.lat, d.lon]);
    let radius = radiusScale(d.capacity || 0);
    let color = technologyColors[d.technology] || '#aaa';
    
    marker.setStyle({
      radius: radius,
      fillColor: color,
      fillOpacity: 0.75,
      color: color,
      weight: 1
    });

    marker.bindTooltip(getTooltipContent(d));
    marker.addTo(map);
  });
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => draw(data));
