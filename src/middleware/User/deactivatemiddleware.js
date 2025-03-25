// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "No token provided." });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(401).json({ message: "User not found." });
//     }
//     if (!user.isActive) {
//       req.logout();

//       return res
//         .status(403)
//         .json({ message: "Account is deactivated. You have been logged out." });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(500).json({ message: "Server error.", error });
//   }
// };

// module.exports = authMiddleware;
