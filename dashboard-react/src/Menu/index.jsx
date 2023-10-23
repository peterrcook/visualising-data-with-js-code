import Dropdown from '../Dropdown';

import './style.css';

function Menu(props) {
  return (
    <div id="menu">
      <Dropdown id="region" label="Region" data={props.data} action={props.action} value={props.filter.region}></Dropdown>
      <Dropdown id="technology" label="Technology" data={props.data} action={props.action} value={props.filter.technology}></Dropdown>
      <Dropdown id="status" label="Status" data={props.data} action={props.action} value={props.filter.status}></Dropdown>
      <Dropdown id="yearSubmitted" label="Year submitted" data={props.data} action={props.action} value={props.filter.yearSubmitted}></Dropdown>
    </div>
  );
}

export default Menu;
