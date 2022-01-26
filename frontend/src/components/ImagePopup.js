import Popup from "./Popup";

function ImagePopup(props) {
  return (
    <Popup {...props}>
      <figure className="figure">
        <img className="figure__image" src={props.card.link} alt={props.card.name} />
        <figcaption className="figure__caption">{props.card.name}</figcaption>
      </figure>
    </Popup>
  );
}

export default ImagePopup;
