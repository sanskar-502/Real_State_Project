import "./aboutPage.scss";

function AboutPage() {
  return (
    <div className="aboutPage yellow-theme">
      <div className="about-hero">
        <h1>About <span className="brand">MapNest</span></h1>
        <p className="about-tagline">
          Your trusted partner for finding, buying, and renting real estate with confidence and ease.
        </p>
      </div>
      <div className="about-main-card">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At <span className="brand">MapNest</span>, our mission is to empower people to find their dream homes and investment properties through a seamless, transparent, and enjoyable experience. We combine technology with a passion for real estate to make property discovery simple and rewarding for everyone.
          </p>
        </section>
        <section className="about-section">
          <h2>Why Choose MapNest?</h2>
          <ul>
            <li>Extensive, up-to-date property listings for every need and budget</li>
            <li>Verified agents and secure, transparent transactions</li>
            <li>Modern, user-friendly interface and advanced search tools</li>
            <li>Real-time chat, notifications, and dedicated support</li>
            <li>Community-driven reviews and trusted recommendations</li>
          </ul>
        </section>
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2025 by <span className="brand">Sanskar Dubey</span>, <span className="brand">MapNest</span> was born from the belief that everyone deserves a better way to find their next home or investment. This platform is designed, developed, and maintained solely by Sanskar Dubey.
          </p>
        </section>
        <section className="about-section developer-section">
          <h2>Developer</h2>
          <div className="developer-info">
            <img src="/profilePic.jpg" alt="Sanskar Dubey" />
            <div>
              <h3>Sanskar Dubey</h3>
              <p>Founder & Full Stack Developer</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage; 