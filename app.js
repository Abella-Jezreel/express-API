const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();
app.use(bodyParser.json());

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

// Add a route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Express API");
});

mongoose
  .connect("mongodb+srv://teamabella:Dreambig060420!@cluster0.yf3vq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(8081, () => {
      console.log("Server is running on port 8081");
    });
  })
  .catch((err) => console.log(err));
