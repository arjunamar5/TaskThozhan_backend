const jwt = require("jsonwebtoken");

const verifyEmployer = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure userType is 'Employer'
    if (!decoded.userType || decoded.userType.toLowerCase() !== "employer") {
      return res.status(403).json({ message: "Access denied. Not an employer." });
    }

    // ✅ Attach only the necessary fields to req.user
    req.user = {
      id: decoded.id,
      userType: decoded.userType
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyEmployer;
