import { useState, useEffect } from 'react';

import Menu from '../Menu';
import Charts from '../Charts';
import { getFilteredData } from '../filter';

import './style.css';

const initialFilter = {
  region: 'All',
  technology: 'All',
  status: 'All',
  yearSubmitted: 'All'
};

function App() {
  const [data, setData] = useState();
  const [filter, setFilter] = useState(initialFilter);

  function action(type, props) {
    switch(type) {
    case 'setFilter':
      let newFilter = {...filter};
      newFilter[props.id] = props.value;
      setFilter(newFilter);
      break;
    default:
      break;
    }
  }

  useEffect(() => {
    fetch('./repd.json')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if(!data) return;
  
  let filteredData = getFilteredData(data, filter);
  
  return (
    <div id="app">
      <h1>Renewable Energy Planning Database Explorer (1990-2022)</h1>
      <Menu data={data} filter={filter} action={action}></Menu>
      <Charts data={filteredData}></Charts>
    </div>
  );
}

export default App;
