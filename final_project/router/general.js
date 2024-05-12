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

function getAllBooks() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Object.values(books)); 
        }, 3000); 
    });
}

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn]; 
            book ? resolve(book) : reject(new Error("Book not found"));
        }, 3000);
    });
}

function getBooksByAuthor(author) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = Object.values(books).filter(b => b.author === author);
            resolve(results.length ? results : "No books found by this author");
        }, 3000);
    });
}

function getBooksByTitle(title) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = Object.values(books).filter(b => b.title === title);
            resolve(results.length ? results : "No books found with this title");
        }, 3000);
    });
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getAllBooks();
        res.json(allBooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);
        res.json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);
        res.json(booksByAuthor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const booksByTitle = await getBooksByTitle(req.params.title);
        res.json(booksByTitle);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
