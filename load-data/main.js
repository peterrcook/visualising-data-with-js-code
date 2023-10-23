import './style.css';

function makeList(data) {
  // Filter
  data = data.filter(d => d.technology === "Battery" && d.capacity > 100);

  // Build a list from the data
  let list = '';
  data.forEach(d => {
    list += '<div>' + d.name + ' (' + d.region + ') ' + d.capacity + 'MW</div>';
  });

  document.querySelector('#output').innerHTML = list;
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => makeList(data));
