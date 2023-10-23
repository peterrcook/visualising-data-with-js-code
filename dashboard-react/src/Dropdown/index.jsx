import uniq from 'lodash-es/uniq';

import './style.css';

function Dropdown(props) {
  function handleChange(e) {
    props.action('setFilter', {
      id: props.id,
      value: e.target.value
    });
  }

  let values = uniq(props.data.map(d => d[props.id]));
  values = values.filter(d => d !== '' && d !== null).sort();
  values = ['All'].concat(values);

  return (
    <div className="dropdown">
      <label>{props.label}</label>
      <select onChange={handleChange} value={props.value}>
        {values.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
}

export default Dropdown;

