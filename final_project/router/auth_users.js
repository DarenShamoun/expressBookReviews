const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
      res.json({ message: "User successfully logged in", token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.query;
    const { username } = req.user;
    if (!books[req.params.isbn].reviews) books[req.params.isbn].reviews = {};
    if (!books[req.params.isbn].reviews[username]) {
      books[req.params.isbn].reviews[username] = { review };
    } else {
      books[req.params.isbn].reviews[username].review = review;
    }
    res.json({ message: "Review updated successfully", reviews: books[req.params.isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.user;
    if (books[req.params.isbn].reviews && books[req.params.isbn].reviews[username]) {
      delete books[req.params.isbn].reviews[username];
      res.json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found or not yours to delete" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
