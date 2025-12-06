const jwt = require('jsonwebtoken');

const verifyEmployee = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Authorization header

  if (!token) {
    console.log("❌ No token, authorization denied");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token using secret key
    req.user = decoded.user;  // Attach decoded user data to request object
    console.log("✅ Token verified successfully for user:", req.user.id);
    next();  // Proceed to next middleware or route handler
  } catch (err) {
    console.error("❌ Token verification failed:", err);  // Log token verification errors
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyEmployee;
