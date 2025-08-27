import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState, useEffect, useCallback } from "react";

const PostList = ({ posts, onCountChange }) => {
  useEffect(() => {
    onCountChange(posts.length);
  }, [posts.length, onCountChange]);

  if (posts.length === 0) {
    return (
      <div className="noResults">
        <div className="noResultsIcon">🏠</div>
        <h3>No properties found</h3>
        <p>Try adjusting your search criteria or browse all properties</p>
      </div>
    );
  }

  return (
    <div className="propertyGrid">
      {posts.map((post) => (
        <Card key={post.id} item={post} />
      ))}
    </div>
  );
};

function ListPage() {
  const data = useLoaderData();
  const [resultCount, setResultCount] = useState(0);

  const handleCountChange = useCallback((count) => {
    setResultCount(count);
  }, []);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter resultCount={resultCount} />
          
          <Suspense fallback={
            <div className="loadingState">
              <div className="loadingSpinner"></div>
            </div>
          }>
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="errorState">
                  <p>Error loading properties! Please try again later.</p>
                </div>
              }
            >
              {(posts) => (
                <PostList 
                  posts={posts} 
                  onCountChange={handleCountChange}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
      
      <div className="mapContainer">
        <div className="mapWrapper">
          <Suspense fallback={
            <div className="loadingState">
              <div className="loadingSpinner"></div>
            </div>
          }>
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="errorState">
                  <p>Error loading map!</p>
                </div>
              }
            >
              {(posts) => <Map items={posts} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;