import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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
    const size = safeParseInt(inputs.size, 100000000, 1); // Max 100M sqft, min 1
    const bedroom = safeParseInt(inputs.bedroom, 20, 1); // Max 20 bedrooms
    const bathroom = safeParseInt(inputs.bathroom, 20, 1); // Max 20 bathrooms

    if (price === 0) {
      setError("Please enter a valid price.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
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
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: size,
          school: safeParseFloat(inputs.school),
          bus: safeParseFloat(inputs.bus),
          restaurant: safeParseFloat(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Create New Property Listing</h1>
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
                title="Maximum price: ₹10,000,000,000 (10 billion)"
                required 
              />
            </div>

            <div className="item">
              <label htmlFor="type">Listing Type</label>
              <select name="type" required>
                <option value="rent">For Rent</option>
                <option value="buy">For Sale</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property Type</label>
              <select name="property" required>
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
                title="Maximum: 100,000,000 sqft"
                required 
              />
            </div>

            {/* Policies */}
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" required>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared responsibility</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" required>
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

            <button 
              className="sendButton" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Listing"}
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
          <div className="uploadText">Upload Property Images</div>
          <div className="uploadHint">Click to add photos of your property</div>
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

export default NewPostPage;
