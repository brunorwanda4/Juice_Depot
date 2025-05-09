const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
exports.signup = (req, res) => {
  // Removed 'async'
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res
      .status(400)
      .json({ message: "Username, password, and userType are required 😡" });
  }

  if (userType !== "ADMIN" && userType !== "WORKER") {
    return res.status(400).json({
      message: `Your user type '${userType}' is not supported. Choose ADMIN or WORKER.`,
    });
  }

  db.query(
    "SELECT * FROM Users WHERE userName = ?",
    [username],
    (err, existingUsers) => {
      if (err) {
        console.error("Database error checking user existence:", err);
        return res.status(500).json({
          message: "Something went wrong while checking username.",
          error: err.message,
        });
      }

      if (existingUsers.length > 0) {
        return res
          .status(409)
          .json({ message: "Username already exists, please try another." });
      }

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          db.query(
            "INSERT INTO Users (userName, passWord, userType) VALUES (?, ?, ?)",
            [username, hashedPassword, userType],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Database error creating user:", insertErr);
                return res.status(500).json({
                  message:
                    "Failed to create new account due to database error.",
                  error: insertErr.message,
                });
              }

              if (insertResult && insertResult.affectedRows === 1) {
                return res.status(201).json({
                  message: "Account created successfully.",
                  userId: insertResult.insertId,
                  username: username,
                  userType: userType,
                });
              } else {
                console.error(
                  "User insertion failed, affectedRows not 1 or unexpected result:",
                  insertResult
                );
                return res.status(500).json({
                  message:
                    "Failed to create new account, unknown database issue during insert.",
                });
              }
            }
          );
        })
        .catch((hashErr) => {
          console.error("Error hashing password:", hashErr);
          return res.status(500).json({
            message: "Failed to process password.",
            error: hashErr.message,
          });
        });
    }
  );
};
