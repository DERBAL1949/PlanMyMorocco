import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Add JWT_SECRET to .env
    req.user = decoded; // you can access req.user in other routes
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default verifyToken;
