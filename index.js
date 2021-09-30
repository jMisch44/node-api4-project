require("dotenv").config();
const express = require("express");
const cors = require("cors");

const server = express();

server.use(cors());
server.use(express.json());

const userData = [
  { id: 0, userName: "Bob" },
  { id: 1, userName: "John" },
  { id: 2, userName: "Jane" },
];

server.get("/api/users", (req, res) => {
  res.status(200).json(userData);
});

server.get("*", (req, res) => {
  res.send("<p>check url</p>");
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
