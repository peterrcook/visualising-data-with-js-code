import { useState, useEffect } from 'react';
import { tidy, count, rename, sort } from '@tidyjs/tidy';

import BarChart from './BarChart';

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('./repd.json')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if(!data) return;

  let technologyCount = tidy(
    data,
    count('technology', {sort: true}),
    rename({technology: 'name'})
  );

  return (
    <div id="app">
      <BarChart data={technologyCount}></BarChart>
    </div>
  )
}

export default App;
