import { useState, useEffect, createElement as h } from 'react';
import { tidy } from '@tidyjs/tidy';
import './style.css'

import Menu from '../Menu';
import Charts from '../Charts';
import Overlay from '../Overlay';

const initialFilter = {
  region: 'All',
  technology: 'All',
  status: 'All',
  yearSubmitted: 'All'
};

function App() {
  const [data, setData] = useState();
  const [filter, setFilter] = useState(initialFilter);
  const [isWaiting, setIsWaiting] = useState(false);

  function makeRequest(filter) {
    let url = 'http://localhost:3000/dashboard';
    url = url + '?filter=' + encodeURIComponent(JSON.stringify(filter));

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsWaiting(false);
      });

    setIsWaiting(true);
  }

  function action(type, props) {
    switch(type) {
    case 'setFilter':
      let newFilter = {...filter};
      newFilter[props.id] = props.value;
      setFilter(newFilter);
      makeRequest(newFilter);
      break;
    default:
      break;
    }
  }

  useEffect(() => {
    makeRequest(filter);
  }, []);

  if (!data) return <Overlay message="Loading..." />

  return (
    <div id="app">
      <h1>Renewable Energy Planning Database Explorer (1990-2022)</h1>
      <Menu values={data.menu} filter={filter} action={action}></Menu>
      <Charts data={data.charts}></Charts>
      <Overlay message={isWaiting ? "Updating..." : null}></Overlay>
    </div>
  )
}

export default App;
