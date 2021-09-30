require("dotenv").config();
const express = require("express");
const cors = require("cors");

const server = express();

server.use(cors());
server.use(express.json());

const userData = [
  { id: 0, userName: "Bob", password: "fake0" },
  { id: 1, userName: "John", password: "fake1" },
  { id: 2, userName: "Jane", password: "fake2" },
];

function addUser(user) {
  return userData.push(user);
}

function userLogin(user) {
  return { message: `Hello ${user.userName}` };
}

server.get("/api/users", (req, res) => {
  res.status(200).json(userData);
});

server.post("/api/register", (req, res) => {
  addUser(req.body);
  res.status(201).json(req.body);
});

server.post("/api/login", (req, res) => {
  res.status(201).json(userLogin(req.body));
});

server.get("/", (req, res) => {
  res.send("<p>Heroku Deploying Project</p>");
});

server.get("*", (req, res) => {
  res.send("<p>check url</p>");
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
