const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URI;


// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kismatikproperty-eta.vercel.app",
      "https://www.kismatkiproperty.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes (ensure each route file exports Router object)
const userRoutes = require("./routes/userRoutes");
const classifiedRoutes = require("./routes/classifiedRoutes");
const leadRoutes = require("./routes/leadRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes"); 

app.use("/api/users", userRoutes);
app.use("/api", classifiedRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/inquiry", inquiryRoutes); 

// Test route
app.get("/", (req, res) => res.send("Backend is running"));

// MongoDB connection
mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
