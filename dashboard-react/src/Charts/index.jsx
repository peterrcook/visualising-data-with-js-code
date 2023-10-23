import { tidy, filter, count, rename, sort } from '@tidyjs/tidy';

import Map from '../Map';
import BarChart from '../BarChart';
import LineChart from '../LineChart';
import { technologyColorScale } from '../color';

import './style.css';

function Charts(props) {
  let regionCount = tidy(
    props.data,
    count('region', {sort: true}),
    rename({region: 'name'})
  );

  let technologyCount = tidy(
    props.data,
    count('technology', {sort: true}),
    rename({technology: 'name'})
  );
  
  let statusCount = tidy(
    props.data,
    count('status', {sort: true}),
    rename({status: 'name'})
  );

  let yearSubmittedCount = tidy(
    props.data,
    count('yearSubmitted'),
    sort('yearSubmitted'),
    rename({yearSubmitted: 'name'})
  );

  return (
    <div id="charts">
      <Map data={props.data} title="Locations"></Map>
      <BarChart data={regionCount} title="Region"></BarChart>
      <BarChart data={technologyCount} title="Technology" colorScale={technologyColorScale}></BarChart>
      <BarChart data={statusCount} title="Status"></BarChart>
      <LineChart data={yearSubmittedCount} title="Year Submitted"></LineChart>
    </div>
  );
}

export default Charts;
