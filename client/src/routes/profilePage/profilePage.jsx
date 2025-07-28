import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaList, FaBookmark, FaComments } from "react-icons/fa";

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
      console.log(err);
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
            <h1>My List</h1>
            <Link to="/add">
              <button className="primary">Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
        </section>

        <section className="listCard">
          <div className="sectionHeader">
            <FaBookmark className="sectionIcon" />
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => {
                console.log("Saved posts in profile:", postResponse.data.savedPosts);
                return <List posts={postResponse.data.savedPosts} />;
              }}
            </Await>
          </Suspense>
        </section>
      </div>
      <div className="chatColumn">
        <div className="chatCard">
          <div className="sectionHeader">
            <FaComments className="sectionIcon" />
            <h1>Chats</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data}/>} 
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
