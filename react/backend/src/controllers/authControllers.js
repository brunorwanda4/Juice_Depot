const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { username, password, userType } = req.body;
  if (!username || !password || !userType) {
    return res
      .status(400)
      .json({ message: "Username, password, userType are required 😡" });
  }

  if (userType !== "ADMIN" && userType !== "WORKER") {
    return res.status(400).json({
      message: `your user type is  not supported ${userType}, choose ADMIN or WORKER`,
    });
  }

  try {
    const [existingUser] = await db.promise.query(
      "SELECT * FROM users WHERE username = ? ",
      [username], (err , result) => {
        if (err) {
            return res.status(500).json({message : "something went wrong", err})
        }
      }
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "username is ready exit, please try other" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await db
      .promise()
      .query(
        "INSERT INTO users (userName , password, userType)",
        [username, hashPassword, userType],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Failed to create new account", err });
          }
          return res
            .status(201)
            .json({ message: "Account is created", user: result });
        }
      );
  } catch (error) {
    return res.status(500).json({
      message: "Some thing went wrong to create account",
      error,
    });
  }
};
