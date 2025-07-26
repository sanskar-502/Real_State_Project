import "./contactPage.scss";

function ContactPage() {
  return (
    <div className="contactPage">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Email: Sanskardubey50@gmail.com</p>
          <p>Phone: +91 9155332317</p>
          <p>Address: Bangalore, India</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage; 