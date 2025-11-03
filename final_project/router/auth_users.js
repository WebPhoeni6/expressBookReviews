const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = process.env.JWT_SECRET;
const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if both fields are provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        // Find user by username
        const user = users.find(
            (user) => user.username === username && user.password === password
        );

        // If user not found or password incorrect
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // Generate JWT
        const accessToken = jwt.sign(
            { username: user.username },
            secretKey,
            { expiresIn: "1h" } // expires in 1 hour
        );

        // Return success with token
        return res.status(200).json({
            message: "Login successful",
            token: accessToken,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        const isbn = req.params.isbn;
        const review = req.query.review;

        // Check if the book exists
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if review text is provided
        if (!review) {
            return res.status(400).json({ message: "Review text is required" });
        }

        // Get the JWT token from header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(" ")[1];
        let decodedUser;

        // Verify token
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }
            decodedUser = user;
        });

        const username = decodedUser.username;

        // Initialize reviews if not present
        if (!book.reviews) {
            book.reviews = {};
        }

        // Add or update the review under this username
        book.reviews[username] = review;

        return res.status(200).json({
            message: "Review added/updated successfully",
            reviews: book.reviews,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    try {
      const isbn = req.params.isbn;
  
      // Check if the book exists
      const book = books[isbn];
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Check if reviews exist
      if (!book.reviews || Object.keys(book.reviews).length === 0) {
        return res.status(400).json({ message: "No reviews available for this book" });
      }
  
      // Extract JWT token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
      }
  
      const token = authHeader.split(" ")[1];
      let decodedUser;
  
      // Verify the JWT token
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        decodedUser = user;
      });
  
      const username = decodedUser.username;
  
      // Check if this user has a review for this book
      if (!book.reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
      }
  
      // Delete the user's review
      delete book.reviews[username];
  
      return res.status(200).json({
        message: "Your review has been deleted successfully",
        reviews: book.reviews,
      });
  
    } catch (error) {
      console.error("Error deleting review:", error.message);
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
