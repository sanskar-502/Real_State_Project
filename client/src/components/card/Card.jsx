import { Link, useNavigate } from "react-router-dom";
import "./card.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function Card({ item }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt={item.title} />
        <div className="propertyType">{item.property}</div>
        <div className="listingType">{item.type}</div>
        <div className="price">₹ {item.price.toLocaleString()}</div>
      </Link>
      
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        
        <p className="address">
          <img src="/pin.png" alt="Location" />
          <span>{item.address}</span>
        </p>
        
        <div className="features">
          <div className="feature">
            <img src="/bed.png" alt="Bedrooms" />
            <span>{item.bedroom} bed</span>
          </div>
          <div className="feature">
            <img src="/bath.png" alt="Bathrooms" />
            <span>{item.bathroom} bath</span>
          </div>
          {item.size && (
            <div className="feature">
              <img src="/size.png" alt="Size" />
              <span>{item.size} sqft</span>
            </div>
          )}
        </div>
        
        <div className="bottom">
          <div className="propertyInfo">
            {item.size && (
              <div className="propertySize">
                <img src="/size.png" alt="Size" />
                <span>{item.size} sqft</span>
              </div>
            )}
            <div className="amenities">
              {item.postDetail?.utilities && `${item.postDetail.utilities} • `}
              {item.postDetail?.pet && `${item.postDetail.pet} pets`}
            </div>
          </div>
          
          <div className="icons">
            <div className="icon" title="Save to favorites">
              <img src="/save.png" alt="Save" />
            </div>
            <div 
              className="icon" 
              title="Contact agent"
              onClick={async (e) => {
                e.preventDefault();
                if (!currentUser) {
                  navigate("/login");
                  return;
                }
                try {
                  
                  const res = await apiRequest.post("/chats", {
                    receiverId: item.userId
                  });
               
                  navigate("/profile", { state: { openChat: res.data.id } });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <img src="/chat.png" alt="Chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
