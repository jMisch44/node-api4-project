require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const server = express();

const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.log(err);
  }
  return null;
};

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.log(err);
  }
  return false;
};

server.use(cors());
server.use(express.json());

const userData = [
  { id: 0, userName: "Bob", password: "" },
  { id: 1, userName: "John", password: "" },
  { id: 2, userName: "Jane", password: "" },
];

async function findUser(user) {
  return await userData.find((users) => user.userName === users.userName);
}

async function addUser(user) {
  const hashedPass = await hashPassword(user.password);
  userData.push({ ...user, password: hashedPass });
  return userData[userData.length - 1];
}

async function userLogin(user) {
  const dbUser = await findUser(user);
  const validUser = await comparePassword(user.password, dbUser.password);
  if (validUser) {
    return { message: `Hello ${dbUser.userName}` };
  } else {
    return { message: `invalid password!!` };
  }
}

server.get("/api/users", (req, res) => {
  res.status(200).json(userData);
});

server.post("/api/register", async (req, res) => {
  res.status(201).json(await addUser(req.body));
});

server.post("/api/login", async (req, res) => {
  res.status(201).json(await userLogin(req.body));
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
