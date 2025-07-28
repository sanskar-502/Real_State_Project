import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";

function ListPage() {
  const data = useLoaderData();
  const [resultCount, setResultCount] = useState(0);

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
              {(postResponse) => {
                const posts = postResponse.data;
                setResultCount(posts.length);
                
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
              }}
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
              {(postResponse) => <Map items={postResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;
