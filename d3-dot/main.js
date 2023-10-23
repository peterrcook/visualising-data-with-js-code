import { select } from 'd3-selection';
import { scaleTime, scalePoint, scaleSqrt } from 'd3-scale';
import { max, extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { tidy, count, filter, mutate, sort, desc } from '@tidyjs/tidy';
import Popup from '@flourish/popup';

import './style.css';

let popup = Popup();

let green = '#358600';
let grey = '#aaa';
let purple = '#A675A1';
let yellow = '#F5CF29';

let statusColors = {
  'Abandoned': grey,
  'Appeal Withdrawn': grey,
  'Application Refused': grey,
  'Application Submitted': purple,
  'Application Withdrawn': grey,
  'Awaiting Construction': yellow,
  'Decommissioned': grey,
  'No Application Required': yellow,
  'Operational': green,
  'Planning Permission Expired': grey,
  'Under Construction': yellow
};

function update(data) {
  let width = 1200, height = 600;
  let leftMargin = 210, rightMargin = 20, topMargin = 20, bottomMargin = 40;

  // x scale
  let dateSubmittedExtent = extent(data, d => d.dateSubmitted);
  let xLength = width - leftMargin - rightMargin;
  let xScale = scaleTime()
      .domain(dateSubmittedExtent)
      .range([0, xLength]);

  // y scale
  let technologyValues = tidy(
    data,
    count('technology'),
    sort('technology')
  ).map(d => d.technology);
  let yLength = height - topMargin - bottomMargin;
  let yScale = scalePoint()
      .domain(technologyValues)
      .range([0, yLength]);

  // radius scale
  let maxCapacity = max(data, d => d.capacity);
  let maxRadius = 20;
  let rScale = scaleSqrt()
      .domain([0, maxCapacity])
      .range([0, maxRadius]);

  select('svg')
    .attr('width', width)
    .attr('height', height);

  select('svg .inner')
    .attr('transform', 'translate(' + leftMargin + ',' + topMargin + ')');

  // Points
  select('svg .points')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', d => xScale(d.dateSubmitted))
    .attr('cy', d => yScale(d.technology))
    .attr('r', d => rScale(d.capacity))
    .style('fill', d => statusColors[d.status])
    .style('stroke', d => statusColors[d.status])
    .style('fill-opacity', 0.5)
    .on('mouseover', (e, d) => {
      let html = '';
      html += '<div>Name: ' + d.name + '</div>';
      html += '<div>Technology: ' + d.technology + '</div>';
      html += '<div>Capacity: ' + d.capacity + ' MW</div>';
      html += '<div>Date submitted: ' + d.dateSubmitted.toDateString() + '</div>';
      html += '<div>Status: ' + d.status + '</div>';
      popup
        .point(e.target)
        .html(html)
        .draw();
    })
    .on('mouseout', () => {
      popup.hide();
    });

  // y-axis
  let yAxis = axisLeft(yScale)
      .tickSize(0);

  select('svg .y-axis')
    .call(yAxis);

  // x-axis
  let xAxis = axisBottom(xScale)
      .tickSize(yLength + 20);

  select('svg .x-axis')
    .call(xAxis);
}

function init(data) {
  data = tidy(
    data,
    filter(d => d.dateSubmitted !== null),
    mutate({
      dateSubmitted: d => new Date(d.dateSubmitted)
    }),
    sort(desc('capacity'))
  );

  update(data);
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => init(data));
