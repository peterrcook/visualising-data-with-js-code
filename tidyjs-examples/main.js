import { tidy, count, filter, sort, desc, groupBy, summarize, n, mean } from '@tidyjs/tidy';

import './style.css';

function update(data) {
  console.log('data', data);

  let transformed = [];

  // You can uncomment the other transformations to view the result. Make sure you comment out all the others!

  // Filter by status
  transformed = tidy(
    data,
    filter(d => d.status === 'Operational')
  );

  // Count by technology
  // transformed = tidy(
  //   data,
  //   count('technology', {sort: true})
  // );

  // Sort by capacity (descending)
  // transformed = tidy(
  //   data,
  //   sort(desc('capacity'))
  // );

  // Group by technology and compute count and mean capacity for each group. Sort (descending) by mean capacity.
  // transformed = tidy(
  //   data,
  //   groupBy('technology', [
  //     summarize({
  //       count: n(),
  //       meanCapacity: mean('capacity'),
  //     })
  //   ]),
  //   sort(desc('meanCapacity'))
  // );

  console.log('transformed', transformed);
  
  let html = '<pre>' + JSON.stringify(transformed, null, 2) + '</pre>';
  document.querySelector('#output').innerHTML = html;
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => update(data));

