import { defer, redirect } from "react-router-dom";
import apiRequest from "./apiRequest";

// Helper function to validate MongoDB ObjectID format
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const singlePageLoader = async ({ request, params }) => {
  try {
    // Check if the ID format is valid before making the API call
    if (!isValidObjectId(params.id)) {
      // Redirect to 404 page for invalid ID format
      throw redirect("/404");
    }
    
    const res = await apiRequest("/posts/" + params.id);
    return res.data;
  } catch (error) {
    // If it's already a redirect, re-throw it
    if (error.status === 302 || error instanceof Response) {
      throw error;
    }
    
    // Handle API errors (404, 500, etc.)
    if (error.response && error.response.status === 404) {
      // Redirect to 404 page for posts that don't exist
      throw redirect("/404");
    }
    
    // For other errors, still redirect to 404
    console.error("Error loading post:", error);
    throw redirect("/404");
  }
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
