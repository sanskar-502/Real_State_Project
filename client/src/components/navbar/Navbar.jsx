import { useContext, useState } from "react";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if(currentUser) fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>MapNest </span>
        </a>
        <a href="/">Home</a>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/agents">Agents</Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <div className="profileImageWrapper">
              <Link to="/profile" className="profileImageLink">
                <img src={currentUser.avatar || "/noavatar.jpg"} alt="Profile" />
                {number > 0 && <div className="notification">{number}</div>}
              </Link>
            </div>
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          // Hide Sign in button if user is on login or register page
          location.pathname !== "/login" && location.pathname !== "/register" && (
            <a href="/login">Sign in</a>
          )
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt="Menu"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menuOverlay active" : "menuOverlay"} onClick={() => setOpen(false)}></div>
        <div className={open ? "menu active" : "menu"}>
          <button className="closeButton" onClick={() => setOpen(false)}>
            ×
          </button>
          <div className="menuItems">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link to="/agents" onClick={() => setOpen(false)}>Agents</Link>
            {!currentUser && location.pathname !== "/login" && location.pathname !== "/" && location.pathname !== "/register" && (
              <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
            )}
            {currentUser && (
              <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
