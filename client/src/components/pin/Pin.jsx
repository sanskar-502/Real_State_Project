import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  // Guard clause to prevent rendering if item data is incomplete
  if (!item || typeof item.latitude !== 'number' || typeof item.longitude !== 'number') {
    return null;
  }

  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          {/* Check if images exist to prevent errors, 
            and add descriptive alt text for accessibility.
          */}
          {item.images && item.images[0] && (
            <img src={item.images[0]} alt={item.title} />
          )}
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;