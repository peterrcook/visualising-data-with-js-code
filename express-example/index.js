import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/bye', (req, res) => {
  res.send('Bye World!');
});

app.get('/add', (req, res) => {
  let a = parseFloat(req.query.a);
  let b = parseFloat(req.query.b);
  let sum = a + b;

  res.send('The answer is ' + sum);
});

app.get('/data', (req, res) => {
  let myData = [
    { name: 'Battery', n: 20 },
    { name: 'Wind', n: 30 }
  ];

  res.json(myData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
