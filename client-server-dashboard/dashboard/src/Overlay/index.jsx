import './style.css';

function Overlay(props) {
  if (!props.message) return;

  return (
    <div id="overlay">
      <p>{props.message}</p>
    </div>
  );
}

export default Overlay;
