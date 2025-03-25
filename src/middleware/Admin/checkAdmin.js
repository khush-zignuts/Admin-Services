require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");
const { STATUS_CODES } = require("../../config/constant");

const checkAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("authHeader: ", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: "unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    // console.log("token: ", token);

    if (!token) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: i18n.__("Access denied. No token provided.") });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("decoded: ", decoded);

    const admin = await Admin.findOne({ where: { id: decoded.id } });
    // attributes: ["id" , "accessedToken"],
    // console.log("admin: ", admin);
    console.log("Token: ", token);
    console.log("accessToken: ", admin.accessToken);

    if (!admin) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: "unauthorized" });
    }

    try {
      if (admin.accessToken === token) {
        console.log("Token matches!");
      } else {
        console.log("Token does not match.");
      }
    } catch (error) {
      console.error({ message: "unauthorized" });
    }

    // // // Set admin on request object
    req.admin = admin;

    next(); // Proceed if admin
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "unauthorized" });
  }
};

module.exports = checkAdmin;
