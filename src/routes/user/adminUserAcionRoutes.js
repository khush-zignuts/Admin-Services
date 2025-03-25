require("dotenv").config();
const express = require("express");
const router = express.Router();

const {
  deactivateUser,
  listUsers,
} = require("../../controller/user/AdminUsercontroller");
const checkAdmin = require("../../middleware/Admin/checkAdmin");

router.post("/deactivateuser", checkAdmin, deactivateUser);

router.post("/listUsers", listUsers);

module.exports = router;
