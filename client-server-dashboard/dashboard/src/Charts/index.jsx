import Map from '../Map';
import BarChart from '../BarChart';
import LineChart from '../LineChart';

import './style.css';
import { technologyColorScale } from '../color';

function Charts(props) {
  return (
    <div id="charts">
      <Map data={props.data.mapData} title="Locations"></Map>
      <BarChart data={props.data.regionCount} title="Region"></BarChart>
      <BarChart data={props.data.technologyCount} title="Technology" colorScale={technologyColorScale}></BarChart>
      <BarChart data={props.data.statusCount} title="Status"></BarChart>
      <LineChart data={props.data.yearSubmittedCount} title="Year Submitted"></LineChart>
    </div>
  );
}

export default Charts;
