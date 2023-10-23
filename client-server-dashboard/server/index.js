import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { tidy, filter, count, rename, sort } from '@tidyjs/tidy';
import uniq from 'lodash-es/uniq.js';

const port = 3000;

function getData() {
  let f = fs.readFileSync('repd.json', 'utf8');
  let data = JSON.parse(f);
  return data;
}

function getUniqueNames(data, id) {
  let names = uniq(data.map(d => d[id]));
  names = names.filter(d => d !== '' && d !== null).sort();
  return names;
}

function startApp() {
  let data = getData();

  const app = express();

  app.use(cors({
    origin: 'http://localhost:5173'
  }));

  app.get('/dashboard', (req, res) => {
    let dashboardFilter = JSON.parse(decodeURIComponent(req.query.filter));

    let filteredData = tidy(
      data,
      filter(d => dashboardFilter.region === 'All' || dashboardFilter.region === d.region),
      filter(d => dashboardFilter.technology === 'All' || dashboardFilter.technology === d.technology),
      filter(d => dashboardFilter.status === 'All' || dashboardFilter.status === d.status),
      filter(d => dashboardFilter.yearSubmitted === 'All' || parseInt(dashboardFilter.yearSubmitted) === d.yearSubmitted)
    );

    let mapData = filteredData.map(d => {
      return {
        name: d.name,
        lat: d.lat,
        lon: d.lon,
        technology: d.technology,
        capacity: d.capacity,
        operator: d.operator,
        status: d.status
      };
    });

    let regionCount = tidy(
      filteredData,
      count('region', {sort: true}),
      rename({region: 'name'})
    );

    let technologyCount = tidy(
      filteredData,
      count('technology', {sort: true}),
      rename({technology: 'name'})
    );
    
    let statusCount = tidy(
      filteredData,
      count('status', {sort: true}),
      rename({status: 'name'})
    );

    let yearSubmittedCount = tidy(
      filteredData,
      count('yearSubmitted'),
      sort('yearSubmitted'),
      rename({yearSubmitted: 'name'})
    );
    
    let dashboardData = {
      menu: {
        regionValues: getUniqueNames(data, 'region'),
        technologyValues: getUniqueNames(data, 'technology'),
        statusValues: getUniqueNames(data, 'status'),
        yearSubmittedValues: getUniqueNames(data, 'yearSubmitted'),
      },
      charts: {
        mapData: mapData,
        regionCount: regionCount,
        technologyCount: technologyCount,
        statusCount: statusCount,
        yearSubmittedCount: yearSubmittedCount
      }
    };

    res.json(dashboardData);        
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

startApp();
