require("dotenv").config();
const express = require("express");
const adminRoutes = require("./src/routes/Auth/adminRoutes");
const adminBootstrap = require("./src/config/bootstrap");
const sequelize = require("./src/config/db");

// const cookieParser = require("cookie-parser");

//app initialization

const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the authentication i18n system!");
});

// app.use(/adminBootstrapadminBootstrap)

// admin creation
adminBootstrap()
  .then((res) => console.log("adminBootstrap"))
  .catch((err) => console.log(err.message));

//Routes
app.use("/admin", adminRoutes);

// at last port call :
const PORT = process.env.PORT || 5000;
console.log("PORT: ", PORT);

// app.listen(PORT, async () => {
//   // Sync Database and Start Server
//   try {
//     console.log(`Server is running on port ${PORT}`);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

app.listen(PORT, async () => {
  try {
    // Sync database models
    await sequelize.sync({ alter: true }); // or { force: true } to drop & recreate tables (CAUTION)
    console.log("Database synced successfully!");

    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error syncing database:", error.message);
  }
});
