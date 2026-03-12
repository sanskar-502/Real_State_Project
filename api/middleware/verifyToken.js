import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    console.error("✗ No token found in request");
    console.error("Authorization header:", authHeader ? authHeader.substring(0, 50) + "..." : "None");
    console.error("Cookies:", req.cookies);
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.error("✗ Token verification failed:", err.message);
      return res.status(403).json({ message: "Token is not Valid!" });
    }
    
    if (!payload || !payload.id) {
      console.error("✗ Invalid token payload structure");
      return res.status(403).json({ message: "Invalid token payload" });
    }
    
    console.log("✓ Token verified for user:", payload.id);
    req.user = payload;
    req.userId = payload.id;
    
    next();
  });
};
