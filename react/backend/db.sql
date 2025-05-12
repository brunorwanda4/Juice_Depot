DROP DATABASE IF EXISTS Juice_Depot;
CREATE DATABASE Juice_Depot;
USE Juice_Depot;

CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255),
    passWord VARCHAR(255),
    userType VARCHAR(50)
);

CREATE TABLE Products (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255),
    buyUnitPrice DECIMAL(10, 2),
    sellUnitPrice DECIMAL(10, 2)
);

CREATE TABLE Stock_In (
    stockInID INT AUTO_INCREMENT PRIMARY KEY,
    productID INT,
    quantity INT,
    date DATE,
    FOREIGN KEY (productID) REFERENCES Products (productID)
);

CREATE TABLE Stock_Out (
    stockOutID INT AUTO_INCREMENT PRIMARY KEY,
    productID INT,
    quantity INT,
    date DATE,
    FOREIGN KEY (productID) REFERENCES Products (productID)
);