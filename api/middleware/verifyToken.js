import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    
    if (!payload || !payload.id) {
      return res.status(403).json({ message: "Invalid token payload" });
    }
    
    console.log("Token payload:", payload);
    req.user = payload;
    req.userId = payload.id;
    
    next();
  });
};
