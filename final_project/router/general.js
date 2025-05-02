const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    const token = jwt.sign({ username }, "d8#y@GfP!fL^9zR2s3TqWuX7bNmLpA", { expiresIn: 60 * 60 });
  
    if (req.session) {
      req.session.authorization = { token };
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. You can now log in." });
  });
  


  public_users.get('/', function (req, res) {
    // Simulate asynchronous operation using a Promise
    new Promise((resolve, reject) => {
      resolve(books); // Simulate fetching books from DB
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving books." });
    });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    // Simulate async fetch with a Promise
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }
      });
    };
  
    try {
      const book = await getBookByISBN(isbn);
      return res.status(200).json(book);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    // Simulate async data retrieval
    const getBooksByAuthor = (author) => {
      return new Promise((resolve) => {
        const filtered_books = Object.values(books).filter(book => book.author === author);
        resolve(filtered_books);
      });
    };
  
    try {
      const filtered_books = await getBooksByAuthor(author);
      return res.status(200).json(filtered_books);
    } catch (err) {
      return res.status(500).json({ message: "Error retrieving books by author." });
    }
  });
 


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    // Simulate asynchronous behavior
    const getBooksByTitle = (title) => {
      return new Promise((resolve) => {
        const filtered_books = Object.values(books).filter(book => book.title === title);
        resolve(filtered_books);
      });
    };
  
    try {
      const filtered_books = await getBooksByTitle(title);
      return res.status(200).json(filtered_books);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving books by title." });
    }
  });
  

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
