const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { STATUS_CODES } = require("../../config/constant");
const User = require("../../../../User-Services/src/models/User");
const { Op } = require("sequelize");

module.exports = {
  deactivateUser: async (req, res) => {
    try {
      const userId = req.body.userId;
      console.log("userId: ", userId);

      // Check if userId is provided
      if (!userId) {
        return res.json({
          status: 400,
          message: "User ID is required.",
          data: null,
          error: null,
        });
      }

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.json({
          status: 404,
          message: "User not found.",
          data: null,
          error: null,
        });
      }

      if (!user.isActive) {
        return res.json({
          status: 403,
          message: "Account is already deactivated.",
          data: null,
          error: null,
        });
      }

      // Deactivate the user
      await User.update(
        { accessToken: null, isActive: false },
        { where: { id: userId } }
      );

      return res.json({
        status: 200,
        message: "User deactivated successfully.",
        data: { userId },
        error: null,
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      return res.json({
        status: 500,
        message: "Internal server error.",
        data: null,
        error: error.message,
      });
    }
  },
  listUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const search = req.query.q;
      console.log("search: ", search);

      if (search === undefined || search === null || search === "") {
        try {
          // / Fetching users with the constructed 'where' clause

          const { count, rows: users } = await User.findAndCountAll({
            where: { isDeleted: false },
            attributes: ["id", "name", "email"], // Adjust attributes as needed
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10),
          });

          if (users.length === 0) {
            return res.json({
              status: 404,
              message: "No users found.",
              data: [],
              error: null,
            });
          }
          return res.json({
            status: 200,
            message: "Users retrieved successfully.",
            data: users,
            totalRecords: count,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(count / limit),
            error: null,
          });
        } catch (error) {
          console.error("Error retrieving users:", error);
          return res.json({
            status: 500,
            message: "Internal server error.",
            data: null,
            error: error.message,
          });
        }
      } else {
        try {
          const { q: search, page = 1, limit = 10 } = req.query;
          const offset = (page - 1) * limit;

          // Constructing the 'where' clause dynamically
          const whereClause = { isDeleted: false };

          if (search) {
            whereClause[Op.or] = [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
            ];
          }

          // Fetching users with the constructed 'where' clause
          const { count, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: ["id", "name", "email"], // Adjust attributes as needed
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10),
          });

          if (users.length === 0) {
            return res.json({
              status: 404,
              message: "No users found.",
              data: [],
              error: null,
            });
          }

          return res.status(200).json({
            status: 200,
            message: "Users retrieved successfully",
            data: users,
            totalRecords: count,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(count / limit),
          });
        } catch (error) {
          console.error("Error retrieving users:", error);
          return res.json({
            status: 500,
            message: "Internal server error.",
            data: null,
            error: error.message,
          });
        }
      }
    } catch (error) {
      console.error("Error retrieving users:", error);
      return res.json({
        status: 500,
        message: "Internal server error.",
        data: null,
        error: error.message,
      });
    }
  },
};
