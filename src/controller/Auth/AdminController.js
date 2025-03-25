const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { STATUS_CODES } = require("../../config/constant");
const { VALIDATION_RULES } = require("../../config/validationRules");
const Admin = require("../../models/Admin");
const Validator = require("validatorjs");

const validateRequest = (data, rules, res) => {
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: validation.errors.all() });
    return false;
  }
  return true;
};

module.exports = {
  login: async (req, res) => {
    try {
      if (!validateRequest(req.body, VALIDATION_RULES.ADMIN, res)) return;

      const { email, password } = req.body;
      console.log(" req.body: ", req.body);

      // Validate input
      if (!email || !password) {
        return res.json({
          status: STATUS_CODES.BAD_REQUEST,
          message: "Email and password are required.",
          data: null,
          error: null,
        });
      }

      const admin = await Admin.findOne({ where: { email } });
      console.log("admin: ", admin);

      if (!admin) {
        return res.json({
          status: STATUS_CODES.UNAUTHORIZED,
          message: "Invalid email or password",
          data: null,
          error: null,
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      if (!isPasswordCorrect) {
        return res.json({
          status: STATUS_CODES.UNAUTHORIZED,
          message: "Invalid email or password",
          data: null,
          error: null,
        });
      }

      const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });
      admin.accessToken = token;
      await admin.save(); // ✅ Fixed: Now correctly updating instance
      return res.json({
        status: STATUS_CODES.SUCCESS,
        message: "Login successful",
        data: { token },
        error: null,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.json({
        status: STATUS_CODES.SERVER_ERROR,
        message: "Internal server error",
        data: null,
        error: error.message,
      });
    }
  },
};
