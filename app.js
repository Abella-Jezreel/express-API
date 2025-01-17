const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// we need to set headers to avoid CORS issues
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// Add a route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Express API");
});

mongoose
  .connect("mongodb+srv://teamabella:Dreambig060420!@cluster0.yf3vq.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0")
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => console.log(err));
