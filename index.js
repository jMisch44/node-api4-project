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
  {
    id: 0,
    userName: "Bob",
    password: "$2b$10$64HD0xju8mPJdvBFtwErZevY6JXxeSGXAOmy1yULJa38kXsxc0wAy",
  },
  {
    id: 1,
    userName: "John",
    password: "$2b$10$VB7Z7oDRRxQ6bI62LgdQLuGraTH5ktbFxRXg2UQqQn.heQ.9rcfi6",
  },
  {
    id: 2,
    userName: "Jane",
    password: "$2b$10$r5gRNii/8Pd3MoqY34D9QucU0CZR3R/Q40u7GrOUbvCcbcGyAlvGu",
  },
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
  res.send("<h2>Url not found</h2> <p>please check your url</p>");
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
