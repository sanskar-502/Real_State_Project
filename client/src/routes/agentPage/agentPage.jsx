import "./agentPage.scss";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const agents = [
  {
    name: "John Doe",
    photo: "/noavatar.jpg",
    email: "john@realestate.com",
    phone: "+1 234 567 891",
    bio: "John is a top-performing agent with over 10 years of experience helping clients find their dream homes.",
  },
  {
    name: "Jane Smith",
    photo: "/noavatar.jpg",
    email: "jane@realestate.com",
    phone: "+1 234 567 892",
    bio: "Jane specializes in luxury properties and is known for her attention to detail and client satisfaction.",
  },
  {
    name: "Alex Lee",
    photo: "/noavatar.jpg",
    email: "alex@realestate.com",
    phone: "+1 234 567 893",
    bio: "Alex is passionate about real estate and provides expert guidance for first-time home buyers.",
  },
];

function AgentPage() {
  return (
    <div className="agentPage">
      <h1>Our Agents</h1>
      <div className="agent-list">
        {agents.map((agent, idx) => (
          <div className="agent-card" key={idx}>
            <img src={agent.photo} alt={agent.name} />
            <h2>{agent.name}</h2>
            <p className="bio">{agent.bio}</p>
            <div className="contact-info">
              <a href={`mailto:${agent.email}`} className="icon-link" title="Email">
                <FaEnvelope />
              </a>
              <a href={`tel:${agent.phone.replace(/[^\d+]/g, '')}`} className="icon-link" title="Call">
                <FaPhone />
              </a>
            </div>
            <a href={`mailto:${agent.email}`} className="contact-btn">Contact Agent</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentPage; 