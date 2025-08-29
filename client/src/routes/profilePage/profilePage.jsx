import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaList, FaBookmark, FaComments, FaPlus, FaSpinner } from "react-icons/fa";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profilePage twocolumns">
      <div className="profileColumn">
        <div className="userCard">
          <div className="avatarWrapper">
            <img src={currentUser.avatar || "noavatar.jpg"} alt="Avatar" />
          </div>
          <div className="userInfo">
            <h2>{currentUser.username}</h2>
            <p>{currentUser.email}</p>
          </div>
          <div className="userActions">
            <Link to="/profile/update">
              <button className="primary">Update Profile</button>
            </Link>
            <button className="secondary" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <section className="listCard">
          <div className="sectionHeader">
            <FaList className="sectionIcon" />
            <h1>My Properties</h1>
            <Link to="/add">
              <button className="primary">
                <FaPlus style={{ marginRight: '6px', fontSize: '0.8rem' }} />
                Add Property
              </button>
            </Link>
          </div>
          <Suspense fallback={
            <div className="loadingContainer">
              <FaSpinner className="spinner" />
              <p>Loading your properties...</p>
            </div>
          }>
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="errorContainer">
                  <p>❌ Error loading properties. Please refresh the page.</p>
                </div>
              }
            >
              {(postResponse) => {
                const userPosts = postResponse?.data?.data?.userPosts || [];
                
                if (userPosts.length === 0) {
                  return (
                    <div className="emptyState">
                      <FaList className="emptyIcon" />
                      <h3>No Properties Yet</h3>
                      <p>Start building your portfolio by adding your first property listing.</p>
                      <Link to="/add">
                        <button className="primary emptyAction">
                          <FaPlus style={{ marginRight: '8px' }} />
                          Create Your First Property
                        </button>
                      </Link>
                    </div>
                  );
                }
                
                return (
                  <div className="listWrapper">
                    <div className="listStats">
                      <span className="statItem">
                        <strong>{userPosts.length}</strong> Properties Listed
                      </span>
                    </div>
                    <List posts={userPosts} />
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </section>

        <section className="listCard">
          <div className="sectionHeader">
            <FaBookmark className="sectionIcon" />
            <h1>Saved Properties</h1>
          </div>
          <Suspense fallback={
            <div className="loadingContainer">
              <FaSpinner className="spinner" />
              <p>Loading saved properties...</p>
            </div>
          }>
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="errorContainer">
                  <p>❌ Error loading saved properties. Please refresh the page.</p>
                </div>
              }
            >
              {(postResponse) => {
                let savedPosts = [];
                try {
                  if (typeof postResponse?.data?.data?.savedPosts === 'string') {
                    savedPosts = JSON.parse(postResponse.data.data.savedPosts);
                  } else if (Array.isArray(postResponse?.data?.data?.savedPosts)) {
                    savedPosts = postResponse.data.data.savedPosts;
                  }
                } catch (err) {
                  console.error("Error parsing savedPosts:", err);
                }
                
                if (!savedPosts || savedPosts.length === 0) {
                  return (
                    <div className="emptyState">
                      <FaBookmark className="emptyIcon" />
                      <h3>No Saved Properties</h3>
                      <p>Properties you bookmark will appear here for easy access later.</p>
                      <Link to="/list">
                        <button className="primary emptyAction">
                          Browse Properties
                        </button>
                      </Link>
                    </div>
                  );
                }
                
                return (
                  <div className="listWrapper">
                    <div className="listStats">
                      <span className="statItem">
                        <strong>{savedPosts.length}</strong> Saved Properties
                      </span>
                    </div>
                    <List posts={savedPosts} />
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </section>
      </div>
      <div className="chatColumn">
        <div className="chatCard">
          <div className="sectionHeader">
            <FaComments className="sectionIcon" />
            <h1>Messages</h1>
          </div>
          <Suspense fallback={
            <div className="loadingContainer">
              <FaSpinner className="spinner" />
              <p>Loading messages...</p>
            </div>
          }>
            <Await
              resolve={data.chatResponse}
              errorElement={
                <div className="errorContainer">
                  <p>❌ Error loading messages. Please refresh the page.</p>
                </div>
              }
            >
              {(chatResponse) => {
                if (!chatResponse.data || chatResponse.data.length === 0) {
                  return (
                    <div className="emptyState chatEmpty">
                      <FaComments className="emptyIcon" />
                      <h3>No Messages Yet</h3>
                      <p>Start conversations with property owners and potential buyers.</p>
                    </div>
                  );
                }
                return <Chat chats={chatResponse.data}/>;
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
