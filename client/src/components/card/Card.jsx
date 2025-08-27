import { Link, useNavigate } from "react-router-dom";
import "./card.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function Card({ item }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(item.isSaved || false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSaved(item.isSaved || false);
  }, [item.isSaved]);

  // Check saved status on mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!currentUser) return;
      
      try {
        const response = await apiRequest.get(`/users/isSaved/${item.id}`);
        setIsSaved(response.data.isSaved);
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };

    checkSavedStatus();
  }, [item.id, currentUser]);
  return (
    <Link to={`/${item.id}`} className="card">
      <div className="imageContainer">
        <img src={item.images[0]} alt={item.title} />
        <div className="propertyType">{item.property}</div>
        <div className="listingType">{item.type}</div>
        <div className="price">₹ {item.price.toLocaleString()}</div>
      </div>
      
      <div className="textContainer">
        <h2 className="title">
          <span>{item.title}</span>
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
          
          <div className="icons" onClick={e => e.stopPropagation()}>
            <button 
              type="button"
              className={`icon ${isSaved ? 'saved' : ''} ${isLoading ? 'loading' : ''}`} 
              title={isSaved ? "Remove from favorites" : "Save to favorites"}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!currentUser) {
                  navigate("/login");
                  return;
                }
                if (isLoading) return;
                
                setIsLoading(true);
                try {
                  const response = await apiRequest.post("/users/save", { 
                    postId: item.id 
                  });
                  setIsSaved(response.data.isSaved);
                } catch (err) {
                  console.error("Error saving post:", err);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <img src="/save.png" alt={isSaved ? "Unsave" : "Save"} />
            </button>
            <button 
              type="button"
              className="icon" 
              title="Contact agent"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
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
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
