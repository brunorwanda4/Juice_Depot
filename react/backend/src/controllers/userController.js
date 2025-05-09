// controllers/userController.js
const db = require("../config/db"); // Assuming your db connection setup is here
const bcrypt = require("bcrypt");

// User Signup (Create) - Based on your example
exports.signup = (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res
      .status(400)
      .json({ message: "Username, password, and userType are required." });
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

// Get all users (Read)
exports.getAllUsers = (req, res) => {
  db.query("SELECT userId, userName, userType FROM Users", (err, results) => {
    if (err) {
      console.error("Database error fetching users:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch users.", error: err.message });
    }
    res.status(200).json(results);
  });
};

// Get user by ID (Read)
exports.getUserById = (req, res) => {
  const { userId } = req.params;
  db.query(
    "SELECT userId, userName, userType FROM Users WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Database error fetching user:", err);
        return res
          .status(500)
          .json({ message: "Failed to fetch user.", error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Update user (Update) - e.g., change password or userType
exports.updateUser = (req, res) => {
  const { userId } = req.params;
  const { password, userType } = req.body;

  if (!password && !userType) {
    return res
      .status(400)
      .json({ message: "Nothing to update. Provide password or userType." });
  }

  let query = "UPDATE Users SET ";
  const queryParams = [];

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    query += "passWord = ?";
    queryParams.push(hashedPassword);
  }

  if (userType) {
    if (userType !== "ADMIN" && userType !== "WORKER") {
        return res.status(400).json({
          message: `Your user type '${userType}' is not supported. Choose ADMIN or WORKER.`,
        });
    }
    if (queryParams.length > 0) query += ", ";
    query += "userType = ?";
    queryParams.push(userType);
  }

  query += " WHERE userId = ?";
  queryParams.push(userId);

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Database error updating user:", err);
      return res
        .status(500)
        .json({ message: "Failed to update user.", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes made." });
    }
    res.status(200).json({ message: "User updated successfully." });
  });
};

// Delete user (Delete)
exports.deleteUser = (req, res) => {
  const { userId } = req.params;
  db.query("DELETE FROM Users WHERE userId = ?", [userId], (err, result) => {
    if (err) {
      console.error("Database error deleting user:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete user.", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  });
};
