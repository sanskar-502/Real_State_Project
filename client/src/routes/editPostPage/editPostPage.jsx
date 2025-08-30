import { useState, useEffect } from "react";
import "./editPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";

function EditPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Load existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiRequest.get(`/posts/${id}`);
        const post = response.data;
        
        // Check if user owns this post
        if (!post.isOwner) {
          navigate("/404");
          return;
        }
        
        setPostData(post);
        setValue(post.postDetail.desc || "");
        setImages(post.images || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post data");
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  // Safe integer parsing function
  const safeParseInt = (value, max = 10000000000, min = 0) => {
    if (!value || value === '') return 0;
    const parsed = parseInt(value);
    if (isNaN(parsed)) return 0;
    if (parsed < min) return min;
    if (parsed > max) return max;
    return parsed;
  };

  const safeParseFloat = (value, max = 1000000, min = 0) => {
    if (!value || value === '') return 0;
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return 0;
    if (parsed < min) return min;
    if (parsed > max) return max;
    return parsed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validate large numbers before sending
    const price = safeParseInt(inputs.price);
    const size = safeParseInt(inputs.size, 100000000, 1);
    const bedroom = safeParseInt(inputs.bedroom, 20, 1);
    const bathroom = safeParseInt(inputs.bathroom, 20, 1);

    if (price === 0) {
      setError("Please enter a valid price.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updateData = {
        title: inputs.title,
        price: price,
        address: inputs.address,
        city: inputs.city,
        bedroom: bedroom,
        bathroom: bathroom,
        type: inputs.type,
        property: inputs.property,
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        images: images,
        desc: value,
        utilities: inputs.utilities,
        pet: inputs.pet,
        income: inputs.income,
        size: size,
        school: safeParseFloat(inputs.school),
        bus: safeParseFloat(inputs.bus),
        restaurant: safeParseFloat(inputs.restaurant),
      };

      const res = await apiRequest.put(`/posts/${id}`, updateData);
      navigate("/" + id);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="editPostPage">
        <div className="formContainer">
          <div className="loading">Loading post data...</div>
        </div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="editPostPage">
        <div className="formContainer">
          <div className="error">Post not found or you don't have permission to edit it.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="editPostPage">
      <div className="formContainer">
        <h1>Edit Property Listing</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="item">
              <label htmlFor="title">Property Title</label>
              <input 
                id="title" 
                name="title" 
                type="text" 
                placeholder="Enter property title"
                defaultValue={postData.title}
                required 
              />
            </div>
            
            <div className="item">
              <label htmlFor="price">Price (₹)</label>
              <input 
                id="price" 
                name="price" 
                type="number" 
                placeholder="Enter price in rupees"
                min="0"
                max="10000000000"
                step="1000"
                defaultValue={postData.price}
                title="Maximum price: ₹10,000,000,000 (10 billion)"
                required 
              />
            </div>

            <div className="item">
              <label htmlFor="type">Listing Type</label>
              <select name="type" defaultValue={postData.type} required>
                <option value="rent">For Rent</option>
                <option value="buy">For Sale</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property Type</label>
              <select name="property" defaultValue={postData.property} required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* Location Information */}
            <div className="item">
              <label htmlFor="address">Street Address</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                placeholder="Enter street address"
                defaultValue={postData.address}
                required 
              />
            </div>

            <div className="item">
              <label htmlFor="city">City</label>
              <input 
                id="city" 
                name="city" 
                type="text" 
                placeholder="Enter city"
                defaultValue={postData.city}
                required 
              />
            </div>

            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input 
                id="latitude" 
                name="latitude" 
                type="text" 
                placeholder="Enter latitude coordinates"
                defaultValue={postData.latitude}
                required 
              />
            </div>

            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input 
                id="longitude" 
                name="longitude" 
                type="text" 
                placeholder="Enter longitude coordinates"
                defaultValue={postData.longitude}
                required 
              />
            </div>

            {/* Property Details */}
            <div className="item">
              <label htmlFor="bedroom">Bedrooms</label>
              <input 
                min={1} 
                max={20}
                id="bedroom" 
                name="bedroom" 
                type="number" 
                placeholder="Number of bedrooms"
                defaultValue={postData.bedroom}
                title="Maximum: 20 bedrooms"
                required 
              />
            </div>

            <div className="item">
              <label htmlFor="bathroom">Bathrooms</label>
              <input 
                min={1} 
                max={20}
                id="bathroom" 
                name="bathroom" 
                type="number" 
                placeholder="Number of bathrooms"
                defaultValue={postData.bathroom}
                title="Maximum: 20 bathrooms"
                required 
              />
            </div>

            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input 
                min={1} 
                max={100000000}
                id="size" 
                name="size" 
                type="number" 
                placeholder="Property size in square feet"
                defaultValue={postData.postDetail?.size}
                title="Maximum: 100,000,000 sqft"
                required 
              />
            </div>

            {/* Policies */}
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" defaultValue={postData.postDetail?.utilities} required>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared responsibility</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" defaultValue={postData.postDetail?.pet} required>
                <option value="allowed">Pets Allowed</option>
                <option value="not-allowed">No Pets</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="income">Income Requirements</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="e.g., 3x monthly rent"
                defaultValue={postData.postDetail?.income}
              />
            </div>

            {/* Nearby Amenities */}
            <div className="item">
              <label htmlFor="school">Distance to Nearest School (m)</label>
              <input 
                min={0} 
                step="0.1"
                id="school" 
                name="school" 
                type="number" 
                placeholder="Distance to nearest school in meters"
                defaultValue={postData.postDetail?.school}
              />
            </div>

            <div className="item">
              <label htmlFor="bus">Distance to Nearest Bus Stop (m)</label>
              <input 
                min={0} 
                step="0.1"
                id="bus" 
                name="bus" 
                type="number" 
                placeholder="Distance to nearest bus stop in meters"
                defaultValue={postData.postDetail?.bus}
              />
            </div>

            <div className="item">
              <label htmlFor="restaurant">Distance to Nearest Restaurant (m)</label>
              <input 
                min={0} 
                step="0.1"
                id="restaurant" 
                name="restaurant" 
                type="number" 
                placeholder="Distance to nearest restaurant in meters"
                defaultValue={postData.postDetail?.restaurant}
              />
            </div>

            {/* Description */}
            <div className="item description">
              <label htmlFor="desc">Property Description</label>
              <ReactQuill 
                theme="snow" 
                onChange={setValue} 
                value={value}
                placeholder="Describe your property in detail..."
              />
            </div>

            {/* Mobile Image Upload Section */}
            <div className="item mobile-upload">
              <label>Property Images</label>
              {images.length > 0 && (
                <div className="mobile-imageGrid">
                  {images.map((image, index) => (
                    <img src={image} key={index} alt={`Property image ${index + 1}`} />
                  ))}
                </div>
              )}
              <div className="mobile-uploadSection">
                <div className="uploadIcon">📷</div>
                <div className="uploadText">Update Property Images</div>
                <div className="uploadHint">Click to add or replace photos</div>
                <UploadWidget
                  uwConfig={{
                    multiple: true,
                    cloudName: "lamadev",
                    uploadPreset: "estate",
                    folder: "posts",
                  }}
                  setState={setImages}
                />
              </div>
            </div>

            <button 
              className="sendButton" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Listing"}
            </button>
            
            <button 
              type="button"
              className="cancelButton"
              onClick={() => navigate(`/${id}`)}
            >
              Cancel
            </button>
            
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>

      <div className="sideContainer">
        <h3>Property Images</h3>
        
        {images.length > 0 && (
          <div className="imageGrid">
            {images.map((image, index) => (
              <img src={image} key={index} alt={`Property image ${index + 1}`} />
            ))}
          </div>
        )}

        <div className="uploadSection">
          <div className="uploadIcon">📷</div>
          <div className="uploadText">Update Property Images</div>
          <div className="uploadHint">Click to add or replace photos</div>
          <UploadWidget
            uwConfig={{
              multiple: true,
              cloudName: "lamadev",
              uploadPreset: "estate",
              folder: "posts",
            }}
            setState={setImages}
          />
        </div>
      </div>
    </div>
  );
}

export default EditPostPage;
