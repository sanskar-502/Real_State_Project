import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle case where post or postDetail is null
  if (!post) {
    return <div>Post not found</div>;
  }
  
  if (!post.postDetail) {
    return <div>Post details not available</div>;
  }

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      const res = await apiRequest.post("/chats", { receiverId: post.user.id });
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const response = await apiRequest.post("/users/save", { postId: post.id });
      setSaved(response.data.isSaved);
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await apiRequest.delete(`/posts/${post.id}`);
      navigate('/profile'); // Redirect to profile after deletion
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">₹ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail?.desc || "No description available"),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail?.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail?.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail?.income || "Not specified"}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail?.size || 0} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {(post.postDetail?.school || 0) > 999
                    ? (post.postDetail?.school || 0) / 1000 + "km"
                    : (post.postDetail?.school || 0) + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail?.bus || 0}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail?.restaurant || 0}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {/* Owner-only buttons */}
            {post.isOwner && (
              <>
                <button onClick={handleEdit} className="edit-button">
                  <span>✏️</span>
                  Edit Property
                </button>
                <button 
                  onClick={handleDelete} 
                  className="delete-button"
                  disabled={isDeleting}
                >
                  <span>{isDeleting ? '⏳' : '🗑️'}</span>
                  {isDeleting ? "Deleting..." : "Delete Property"}
                </button>
              </>
            )}
            
            {/* Chat button - show for non-owners only */}
            {!post.isOwner && (
              <button onClick={handleSendMessage}>
                <img src="/chat.png" alt="" />
                Send a Message
              </button>
            )}
            
            {/* Save button - show for all users */}
            <button
              onClick={handleSave}
              className={`save-button ${saved ? 'saved' : ''}`}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
