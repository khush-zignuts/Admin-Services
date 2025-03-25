require("dotenv").config();
const express = require("express");
const router = express.Router();
const { login } = require("../../controller/Auth/AdminController");
const adminUserAcionRoutes = require("../user/adminUserAcionRoutes");
const checkAdmin = require("../../middleware/Admin/checkAdmin");

//admin creation

router.post("/login", login);
router.use("/user", checkAdmin, adminUserAcionRoutes);

module.exports = router;
