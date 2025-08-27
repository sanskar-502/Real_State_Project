import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query).then(response => response.data);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts").then(response => {
    console.log("Profile loader response raw:", response);
    
    try {
      // Parse saved posts data
      if (typeof response.data.data.savedPosts === 'string') {
        response.data.data.savedPosts = JSON.parse(response.data.data.savedPosts);
      }
      if (typeof response.data.data.savedPostsData === 'string') {
        response.data.data.savedPostsData = JSON.parse(response.data.data.savedPostsData);
      }

      // Get list of saved post IDs
      const savedPostIds = response.data.data.savedPosts.map(post => post.id);

      // Mark saved posts
      if (response.data.data.savedPosts) {
        response.data.data.savedPosts = response.data.data.savedPosts.map(post => ({
          ...post,
          isSaved: true
        }));
      }
      
      console.log("Profile loader response parsed:", response.data.data);
    } catch (err) {
      console.error("Error parsing response data:", err);
    }
    
    return response;
  });
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
