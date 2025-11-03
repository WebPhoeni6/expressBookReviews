const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        // Check if username already exists
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists",
            });
        }

        // Register new user
        users.push({ username, password });

        return res.status(201).json({
            message: "User registered successfully",
            user: { username },
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});


// Get the book list available in the shop
public_users.get("/", function (req, res) {
    // Create a new Promise that resolves after 6 seconds (simulating async API call)
    let getBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 6000);
    });

    // Log before calling the promise
    console.log("Fetching book list...");

    // Call the promise
    getBooks
        .then((bookData) => {
            console.log("Books fetched successfully!");
            res.status(200).send(JSON.stringify(bookData, null, 2));
        })
        .catch((error) => {
            console.error("Error fetching books:", error);
            res.status(500).json({
                message: "An error occurred while fetching the book list.",
                error: error.message,
            });
        });

    // Log after calling the promise
    console.log("Promise initiated... waiting for resolution...");
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Create a Promise that resolves with the book data
    let fetchBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        }, 6000); // simulate async delay
    });

    console.log("Fetching book by ISBN...");

    fetchBookByISBN
        .then((book) => {
            console.log("Book found!");
            res.status(200).send(JSON.stringify(book, null, 2));
        })
        .catch((error) => {
            console.error("Error fetching book:", error);
            res.status(404).json({ message: error });
        });

    console.log("Promise initiated for ISBN...");
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();

    // Create a Promise to simulate async data fetching
    let fetchBooksByAuthor = new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchedBooks = Object.values(books).filter(
                (book) => book.author.toLowerCase() === author
            );

            if (matchedBooks.length > 0) {
                resolve(matchedBooks);
            } else {
                reject("No books found for this author");
            }
        }, 6000);
    });

    console.log("Fetching books by author...");

    fetchBooksByAuthor
        .then((bookList) => {
            console.log("Books found!");
            res.status(200).send(JSON.stringify(bookList, null, 2));
        })
        .catch((error) => {
            console.error("Error fetching author:", error);
            res.status(404).json({ message: error });
        });

    console.log("Promise initiated for author...");
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
  
    // Promise to simulate async search
    let fetchBooksByTitle = new Promise((resolve, reject) => {
      setTimeout(() => {
        const matchedBooks = Object.values(books).filter(
          (book) => book.title.toLowerCase() === title
        );
  
        if (matchedBooks.length > 0) {
          resolve(matchedBooks);
        } else {
          reject("Book not found");
        }
      }, 6000);
    });
  
    console.log("Fetching books by title...");
  
    fetchBooksByTitle
      .then((result) => {
        console.log("Book(s) found!");
        res.status(200).send(JSON.stringify(result, null, 2));
      })
      .catch((error) => {
        console.error("Error fetching title:", error);
        res.status(404).json({ message: error });
      });
  
    console.log("Promise initiated for title...");
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn;
        const books = require('./booksdb.js'); // import your books data

        // Check if the book exists
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Return the reviews for this book
        res.status(200).send(JSON.stringify(book.reviews, null, 2));
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

module.exports.general = public_users;
