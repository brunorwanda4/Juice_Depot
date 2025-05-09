// controllers/stockController.js
const db = require("../config/db");

// --- Stock In Operations ---

// Record new stock in
// Assumes Stock_In table has stockInID AUTO_INCREMENT PRIMARY KEY
exports.createStockIn = (req, res) => {
  const { productID, quantity, date } = req.body;

  if (!productID || quantity === undefined || !date) {
    return res
      .status(400)
      .json({ message: "productID, quantity, and date are required." });
  }
  if (parseInt(quantity) <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive integer." });
  }
  // Basic date validation (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD."});
  }

  // Check if productID exists
  db.query("SELECT * FROM Products WHERE productID = ?", [productID], (err, products) => {
    if (err) {
        console.error("Database error checking product for stock-in:", err);
        return res.status(500).json({ message: "Error validating product.", error: err.message });
    }
    if (products.length === 0) {
        return res.status(404).json({ message: `Product with ID ${productID} not found.` });
    }

    db.query(
        "INSERT INTO Stock_In (productID, quantity, date) VALUES (?, ?, ?)",
        [productID, parseInt(quantity), date],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Database error creating stock-in record:", insertErr);
            return res.status(500).json({
              message: "Failed to create stock-in record.",
              error: insertErr.message,
            });
          }
          res.status(201).json({
            message: "Stock-in record created successfully.",
            stockInID: result.insertId, // Assumes stockInID is auto-incremented
          });
        }
      );
  });
};

// Get all stock-in records
exports.getAllStockInRecords = (req, res) => {
  db.query("SELECT si.stockInID, si.productID, p.productName, si.quantity, si.date FROM Stock_In si JOIN Products p ON si.productID = p.productID ORDER BY si.date DESC, si.stockInID DESC", (err, results) => {
    if (err) {
      console.error("Database error fetching stock-in records:", err);
      return res.status(500).json({
        message: "Failed to fetch stock-in records.",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};

// Get stock-in record by ID
// Assumes Stock_In table has stockInID
exports.getStockInById = (req, res) => {
    const { stockInId } = req.params;
    db.query(
      "SELECT si.stockInID, si.productID, p.productName, si.quantity, si.date FROM Stock_In si JOIN Products p ON si.productID = p.productID WHERE si.stockInID = ?",
      [stockInId],
      (err, results) => {
        if (err) {
          console.error("Database error fetching stock-in record:", err);
          return res.status(500).json({ message: "Failed to fetch stock-in record.", error: err.message });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: "Stock-in record not found." });
        }
        res.status(200).json(results[0]);
      }
    );
};


// Update stock-in record
// Assumes Stock_In table has stockInID
exports.updateStockIn = (req, res) => {
    const { stockInId } = req.params;
    const { productID, quantity, date } = req.body;

    if (productID === undefined && quantity === undefined && date === undefined) {
        return res.status(400).json({ message: "No fields to update provided." });
    }

    let query = "UPDATE Stock_In SET ";
    const queryParams = [];
    const fieldsToUpdate = [];

    if (productID !== undefined) {
        fieldsToUpdate.push("productID = ?");
        queryParams.push(productID);
    }
    if (quantity !== undefined) {
        if (parseInt(quantity) <= 0) {
            return res.status(400).json({ message: "Quantity must be a positive integer." });
        }
        fieldsToUpdate.push("quantity = ?");
        queryParams.push(parseInt(quantity));
    }
    if (date !== undefined) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD."});
        }
        fieldsToUpdate.push("date = ?");
        queryParams.push(date);
    }

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
    }

    query += fieldsToUpdate.join(", ") + " WHERE stockInID = ?";
    queryParams.push(stockInId);

    // Optional: Validate productID if it's being updated
    if (productID !== undefined) {
        db.query("SELECT * FROM Products WHERE productID = ?", [productID], (pErr, products) => {
            if (pErr) {
                console.error("Database error checking product for stock-in update:", pErr);
                return res.status(500).json({ message: "Error validating product for update.", error: pErr.message });
            }
            if (products.length === 0) {
                return res.status(404).json({ message: `Product with ID ${productID} not found for update.` });
            }
            executeUpdate();
        });
    } else {
        executeUpdate();
    }

    function executeUpdate() {
        db.query(query, queryParams, (err, result) => {
            if (err) {
                console.error("Database error updating stock-in record:", err);
                return res.status(500).json({ message: "Failed to update stock-in record.", error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Stock-in record not found or no changes made." });
            }
            res.status(200).json({ message: "Stock-in record updated successfully." });
        });
    }
};

// Delete stock-in record
// Assumes Stock_In table has stockInID
exports.deleteStockIn = (req, res) => {
    const { stockInId } = req.params;
    db.query("DELETE FROM Stock_In WHERE stockInID = ?", [stockInId], (err, result) => {
        if (err) {
            console.error("Database error deleting stock-in record:", err);
            return res.status(500).json({ message: "Failed to delete stock-in record.", error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Stock-in record not found." });
        }
        res.status(200).json({ message: "Stock-in record deleted successfully." });
    });
};


// --- Stock Out Operations ---

// Record new stock out
// Assumes Stock_Out table has stockOutID AUTO_INCREMENT PRIMARY KEY
exports.createStockOut = (req, res) => {
  const { productID, quantity, date } = req.body;

  if (!productID || quantity === undefined || !date) {
    return res
      .status(400)
      .json({ message: "productID, quantity, and date are required." });
  }
   if (parseInt(quantity) <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive integer." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD."});
  }

  // Check if productID exists
  db.query("SELECT * FROM Products WHERE productID = ?", [productID], (err, products) => {
    if (err) {
        console.error("Database error checking product for stock-out:", err);
        return res.status(500).json({ message: "Error validating product.", error: err.message });
    }
    if (products.length === 0) {
        return res.status(404).json({ message: `Product with ID ${productID} not found.` });
    }

    // Optional: Check if enough stock is available before recording stock_out
    // This would involve querying Stock_In and Stock_Out tables for the productID
    // and calculating current stock. For simplicity, this check is omitted here.

    db.query(
        "INSERT INTO Stock_Out (productID, quantity, date) VALUES (?, ?, ?)",
        [productID, parseInt(quantity), date],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Database error creating stock-out record:", insertErr);
            return res.status(500).json({
              message: "Failed to create stock-out record.",
              error: insertErr.message,
            });
          }
          res.status(201).json({
            message: "Stock-out record created successfully.",
            stockOutID: result.insertId, // Assumes stockOutID is auto-incremented
          });
        }
      );
  });
};

// Get all stock-out records
exports.getAllStockOutRecords = (req, res) => {
  db.query("SELECT so.stockOutID, so.productID, p.productName, so.quantity, so.date FROM Stock_Out so JOIN Products p ON so.productID = p.productID ORDER BY so.date DESC, so.stockOutID DESC", (err, results) => {
    if (err) {
      console.error("Database error fetching stock-out records:", err);
      return res.status(500).json({
        message: "Failed to fetch stock-out records.",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};

// Get stock-out record by ID
// Assumes Stock_Out table has stockOutID
exports.getStockOutById = (req, res) => {
    const { stockOutId } = req.params;
    db.query(
      "SELECT so.stockOutID, so.productID, p.productName, so.quantity, so.date FROM Stock_Out so JOIN Products p ON so.productID = p.productID WHERE so.stockOutID = ?",
      [stockOutId],
      (err, results) => {
        if (err) {
          console.error("Database error fetching stock-out record:", err);
          return res.status(500).json({ message: "Failed to fetch stock-out record.", error: err.message });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: "Stock-out record not found." });
        }
        res.status(200).json(results[0]);
      }
    );
};

// Update stock-out record
// Assumes Stock_Out table has stockOutID
exports.updateStockOut = (req, res) => {
    const { stockOutId } = req.params;
    const { productID, quantity, date } = req.body;

    if (productID === undefined && quantity === undefined && date === undefined) {
        return res.status(400).json({ message: "No fields to update provided." });
    }

    let query = "UPDATE Stock_Out SET ";
    const queryParams = [];
    const fieldsToUpdate = [];

    if (productID !== undefined) {
        fieldsToUpdate.push("productID = ?");
        queryParams.push(productID);
    }
    if (quantity !== undefined) {
         if (parseInt(quantity) <= 0) {
            return res.status(400).json({ message: "Quantity must be a positive integer." });
        }
        fieldsToUpdate.push("quantity = ?");
        queryParams.push(parseInt(quantity));
    }
    if (date !== undefined) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD."});
        }
        fieldsToUpdate.push("date = ?");
        queryParams.push(date);
    }

     if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
    }

    query += fieldsToUpdate.join(", ") + " WHERE stockOutID = ?";
    queryParams.push(stockOutId);

    // Optional: Validate productID if it's being updated
    if (productID !== undefined) {
        db.query("SELECT * FROM Products WHERE productID = ?", [productID], (pErr, products) => {
            if (pErr) {
                console.error("Database error checking product for stock-out update:", pErr);
                return res.status(500).json({ message: "Error validating product for update.", error: pErr.message });
            }
            if (products.length === 0) {
                return res.status(404).json({ message: `Product with ID ${productID} not found for update.` });
            }
            executeUpdate();
        });
    } else {
        executeUpdate();
    }

    function executeUpdate() {
        db.query(query, queryParams, (err, result) => {
            if (err) {
                console.error("Database error updating stock-out record:", err);
                return res.status(500).json({ message: "Failed to update stock-out record.", error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Stock-out record not found or no changes made." });
            }
            res.status(200).json({ message: "Stock-out record updated successfully." });
        });
    }
};

// Delete stock-out record
// Assumes Stock_Out table has stockOutID
exports.deleteStockOut = (req, res) => {
    const { stockOutId } = req.params;
    db.query("DELETE FROM Stock_Out WHERE stockOutID = ?", [stockOutId], (err, result) => {
        if (err) {
            console.error("Database error deleting stock-out record:", err);
            return res.status(500).json({ message: "Failed to delete stock-out record.", error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Stock-out record not found." });
        }
        res.status(200).json({ message: "Stock-out record deleted successfully." });
    });
};
