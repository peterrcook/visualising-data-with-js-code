import Dropdown from '../Dropdown';
import './style.css';

function Menu(props) {
  return (
    <div id="menu">
      <Dropdown id="region" label="Region" values={props.values.regionValues} action={props.action} value={props.filter.region}></Dropdown>
      <Dropdown id="technology" label="Technology" values={props.values.technologyValues} action={props.action} value={props.filter.technology}></Dropdown>
      <Dropdown id="status" label="Status" values={props.values.statusValues} action={props.action} value={props.filter.status}></Dropdown>
      <Dropdown id="yearSubmitted" label="Year submitted" values={props.values.yearSubmittedValues} action={props.action} value={props.filter.yearSubmitted}></Dropdown>
    </div>
  );
}

export default Menu;
