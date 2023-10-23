import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { scaleSqrt } from 'd3-scale';
import { max } from 'd3-array';

import { technologyColorScale } from '../color';

import './style.css';

function getTooltipContent(d) {
  var content = '';
  content += '<h4>' + d.name + '</h4>';
  content += '<div>Technology: ' + d.technology + '</div>';
  content += '<div>Capacity: ' + (d.capacity ? d.capacity + 'MW' : 'Unknown ') + '</div>';
  content += '<div>Operator: ' + d.operator + '</div>';
  content += '<div>Status: ' + d.status + '</div>';
  return content;
}

function Map(props) {
  const containerEl = useRef();
  const map = useRef();
  const markerGroup = useRef();

  function initMap() {
    if(map.current) return;

    map.current = L.map(containerEl.current, {
      scrollWheelZoom: false
    });

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    map.current.setView([54, -3], 6);
    markerGroup.current = L.featureGroup();
    markerGroup.current.addTo(map.current);
  }

  function updatePoints() {
    let maxCapacity = max(props.data, d => d.capacity);
    let maxRadius = 20;
    let radiusScale = scaleSqrt().domain([0, maxCapacity]).range([3, maxRadius]);

    props.data.forEach(d => {
      if (d.lat === null || d.lon === null) return;

      let marker = L.circleMarker([d.lat, d.lon]);
      let radius = radiusScale(d.capacity || 0);
      let color = technologyColorScale(d.technology);

      marker.setStyle({
        radius: radius,
        fillColor: color,
        fillOpacity: 0.75,
        weight: 1,
        opacity : 1,
        color: color
      });

      marker.bindTooltip(getTooltipContent(d));
      marker.addTo(markerGroup.current);
    });
  }

  function updateMap() {
    markerGroup.current.clearLayers();
    updatePoints();
  }

  useEffect(() => {
    initMap();
    updateMap();
  });
  
  return (
    <div className="chart-wrapper">
      <h4>{props.title}</h4>
      <div className="chart">
        <div id="map" ref={containerEl}></div>
      </div>
    </div>
  );
}

export default Map;
