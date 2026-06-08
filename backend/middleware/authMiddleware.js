const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  // Extract the token from the Authorization header (e.g., "Bearer eyJhbGci...")
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded payload (userId, role) to the request object
    next(); // Move on to the protected route
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = requireAuth;