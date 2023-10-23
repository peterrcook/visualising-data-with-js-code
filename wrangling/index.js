const fs = require('fs');
const d3 = require('d3');
const OSPoint = require('ospoint');

let f = fs.readFileSync('repd-january-2023.csv', 'utf8');
let data = d3.csvParse(f);

// console.log(data[0]);

let output = data.map((d, i) => {
  let ret = {};

  ret.id = d['Ref ID'];
  ret.name = d['Site Name'];
  ret.technology = d['Technology Type'];
  ret.capacity = parseFloat(d['Installed Capacity (MWelec)']);

  let point = new OSPoint(d['Y-coordinate'], d['X-coordinate']);
  let lonLat = point.toWGS84();
  
  ret.lon = parseFloat(lonLat.longitude.toFixed(3));
  ret.lat = parseFloat(lonLat.latitude.toFixed(3));

  // ret.address = d.Address;
  ret.region = d.Region;

  ret.status = d['Development Status (short)'];
  ret.operator = d['Operator (or Applicant)'];

  let dateParser = d3.utcParse('%d/%m/%Y'); // If timeParse is used, during BST, the previous day @ 11pm is output!

  let dateSubmitted = dateParser(d['Planning Application Submitted']);
  ret.yearSubmitted = dateSubmitted ? dateSubmitted.getFullYear() : null;
  ret.dateSubmitted = dateSubmitted ? dateSubmitted.toISOString() : null;

  let dateGranted = dateParser(d['Planning Permission Granted']);
  ret.yearGranted = dateGranted ? dateGranted.getFullYear() : null;

  ret.daysUntilGranted = dateSubmitted && dateGranted && dateSubmitted < dateGranted ? d3.timeDay.count(dateSubmitted, dateGranted) : null;

  return ret;
});

// Exclude applications w/out a submission date
output = output.filter(d => d.dateSubmitted !== null);

// Just keep year submitted up to and including Dec 2022
output = output.filter(d => d.yearSubmitted < 2023);

fs.writeFileSync('./repd.json', JSON.stringify(output, null, 2));
