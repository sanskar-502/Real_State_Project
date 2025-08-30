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
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if current user owns this post
  const isOwner = currentUser && currentUser.id === item.userId;

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

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await apiRequest.delete(`/posts/${item.id}`);
      // Reload the page or navigate to refresh the list
      window.location.reload();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${item.id}`);
  };
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
            {/* Owner-only buttons */}
            {isOwner && (
              <>
                <button 
                  type="button"
                  className="icon edit-btn" 
                  title="Edit property"
                  onClick={handleEdit}
                >
                  <span>✏️</span>
                </button>
                <button 
                  type="button"
                  className={`icon delete-btn ${isDeleting ? 'loading' : ''}`} 
                  title="Delete property"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <span>{isDeleting ? '⏳' : '🗑️'}</span>
                </button>
              </>
            )}
            
            {/* Save button - show for all users */}
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
            
            {/* Chat button - show for non-owners only */}
            {!isOwner && (
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
                    console.error(err);
                  }
                }}
              >
                <img src="/chat.png" alt="Chat" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
