const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login (left unimplemented for now)
regd_users.post("/login", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review (left unimplemented for now)
regd_users.put("/auth/review/:isbn", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    const user = authenticatedUser(username, password);
  
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    // Generate JWT token
    const token = jwt.sign({ username }, "d8#y@GfP!fL^9zR2s3TqWuX7bNmLpA",  { expiresIn: 60 * 60 });
  
    return res.status(200).json({ message: "Login successful", token });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   
        const isbn = req.params.isbn;
        const review = req.query.review;
        const username = req.user.username;
      
        const book = books[isbn];
      
        // Check if book exists
        if (!book) {
          return res.status(404).json({ message: "Book not found" });
        }
      
        // Check if review is provided
        if (!review) {
          return res.status(400).json({ message: "Review query is missing" });
        }
      
        // Add or update review
        book.reviews[username] = review;
      
        return res.status(200).json({
          message: "Review successfully posted/updated",
          reviews: book.reviews
        });
      });
      regd_users.delete("/auth/review/:isbn", (req, res) => {
        const isbn = req.params.isbn;
        const username = req.user.username;
        const book = books[isbn];
      
        if (!book) {
          return res.status(404).json({ message: "Book not found" });
        }

        if (book.reviews && book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).json({ message: "Your review was deleted." });
          } else {
            return res.status(404).json({ message: "No review found for this user on the specified book." });
          }
        });
  module.exports.authenticated = regd_users;
  module.exports.isValid = isValid;
  module.exports.users = users;
  