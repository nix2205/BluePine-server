

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

require("./models/Company");
require("./models/User");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const srcRoutes = require("./routes/srcRoutes");
const srcConfigRoutes = require("./routes/srcConfigRoutes");
const adminExpenseRoutes = require("./routes/adminExpenseRoutes");
const userExpenseRoutes = require("./routes/userExpenseRoutes");
const cityMapRoutes = require("./routes/cityMapRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const doctorRoutes = require("./routes/doctorRoutes");


const app = express();

/* 🔥 FIXED CORS CONFIG */
// app.use(
//   cors({
//     origin: "http://localhost:3000", // frontend URL
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:3000",
  "https://blue-pine-web.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/src", srcRoutes);
app.use("/api/src-config", srcConfigRoutes);
app.use("/api/admin", adminExpenseRoutes);
app.use("/api/user-expense", userExpenseRoutes);
app.use("/api/mapping", cityMapRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/doctors", doctorRoutes);


app.get("/", (req, res) => {
  res.send("BluePine API running 🌲");
});

app.use(
  "/company-logos",
  express.static(path.join(process.cwd(), "uploads/company-logos"))
);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error(err));
