import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./notFoundPage.scss";
import apiRequest from "../../lib/apiRequest";

function NotFoundPage() {
  const [reportSent, setReportSent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Report 404 to API for logging
    const report404 = async () => {
      try {
        await apiRequest.get(`/nonexistent-endpoint-404-report?path=${encodeURIComponent(location.pathname)}`);
      } catch (error) {
        // Expected to fail - we're just triggering the API's 404 handler for logging
        console.log("404 reported to API for logging");
      }
    };

    if (!reportSent) {
      report404();
      setReportSent(true);
    }
  }, [location.pathname, reportSent]);

  return (
    <div className="notFoundPage">
      <div className="container">
        <div className="content">
          <div className="errorCode">404</div>
          <div className="errorMessage">
            <h1>Oops! Page Not Found</h1>
            <p>The page you're looking for seems to have wandered off into the digital wilderness.</p>
          </div>
          
          <div className="illustration">
            <div className="house">
              <div className="roof"></div>
              <div className="walls"></div>
              <div className="door"></div>
              <div className="windows">
                <div className="window"></div>
                <div className="window"></div>
              </div>
            </div>
            <div className="questionMark">?</div>
          </div>

          <div className="suggestions">
            <h3>Here's what you can do:</h3>
            <div className="suggestionList">
              <div className="suggestion">
                <span className="icon">🏠</span>
                <Link to="/">Go back to Home</Link>
              </div>
              <div className="suggestion">
                <span className="icon">🔍</span>
                <Link to="/list">Browse Properties</Link>
              </div>
              <div className="suggestion">
                <span className="icon">📞</span>
                <Link to="/contact">Contact Support</Link>
              </div>
              <div className="suggestion">
                <span className="icon">ℹ️</span>
                <Link to="/about">Learn About Us</Link>
              </div>
            </div>
          </div>

          <div className="pathInfo">
            <p>You tried to visit: <code>{location.pathname}</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
