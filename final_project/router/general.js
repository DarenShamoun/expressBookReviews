const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (isValid(username)) {
      return res.status(409).json({ message: "User already exists" });
    }
    users.push({ username, password });
    res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
}); 
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(b => b.author === author);
    if (booksByAuthor.length) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(b => b.title === title);
    if (booksByTitle.length) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.json(book.reviews);
    } else if (book) {
        res.status(404).json({ message: "No reviews found for this book" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
