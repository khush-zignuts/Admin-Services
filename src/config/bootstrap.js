const Admin = require("../models/Admin");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { STATUS_CODES } = require("./constant");

const adminBootstrap = async () => {
  try {
    // console.log("first");

    const existingAdmin = await Admin.findAll({});
    // console.log("existingAdmin: ", existingAdmin);

    if (existingAdmin.length == 0) {
      const admindata = {
        id: uuidv4(),
        name: "admins",
        email: "admin123@gmail.com",
        password: "Admin@123",
        gender: "male",
        city: "city",
        country: "country",
        company_name: "zignuts",
      };

      // console.log("admindata: ", admindata);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admindata.password, salt);

      const newAdmin = await Admin.create({
        id: admindata.id,
        name: admindata.name,
        email: admindata.email,
        password: hashedPassword,
        gender: admindata.gender,
        city: admindata.city,
        country: admindata.country,
        companyName: admindata.company_name,
      });
      // console.log(newAdmin);
    }
    return true;
  } catch (error) {
    console.error("Error in Bootstrap:", error.message);
  }
};

module.exports = adminBootstrap;
