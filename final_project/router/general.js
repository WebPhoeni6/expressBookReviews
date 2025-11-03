const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    try {
        // Convert the books object to a formatted JSON string (indent = 2)
        const formattedBooks = JSON.stringify(books, null, 2);

        res.status(200).send(formattedBooks);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("An error occurred while fetching the book list.");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    try {
        const isbn = req.params.isbn;
       const  book = books[isbn]
       if(!book) {
        return res.status(404).json({message: "Book not found"})
       }

       res.status(200).send(JSON.stringify(book, null, 2));
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });

    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
