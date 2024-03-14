const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get("/", (req, res) => {
    // Use Promise callback to read books data
    readBooksData()
    .then(booksData => {
        res.send(JSON.stringify(booksData, null, 4));
    })
    .catch(error => {
        console.error("Error fetching books:", error);
        res.status(500).send("Error fetching books");
    });
});
  
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    findBookByISBN(isbn)
        .then(book => {
            res.send(book);
        })
        .catch(error => {
            console.error("Error fetching book by ISBN:", error);
            res.status(500).send("Error fetching book by ISBN");
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author;
    findBooksByAuthor(authorName)
        .then(matchingBooks => {
            res.send(JSON.stringify(matchingBooks, null, 4));
        })
        .catch(error => {
            console.error("Error fetching books by author:", error);
            res.status(500).send("Error fetching books by author");
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const bookTitle = req.params.title;
    findBooksByTitle(bookTitle)
        .then(matchingBooks => {
            res.send(JSON.stringify(matchingBooks, null, 4));
        })
        .catch(error => {
            console.error("Error fetching books by title:", error);
            res.status(500).send("Error fetching books by title");
        });
});

// Function to find book by ISBN
function findBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book with ISBN " + isbn + " not found");
        }
    });
}

// Function to find books by author
function findBooksByAuthor(authorName) {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const matchingBooks = [];

        for (const key of bookKeys) {
            if (books[key].author === authorName) {
                matchingBooks.push(books[key]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found for author " + authorName);
        }
    });
}

// Function to find books by title
function findBooksByTitle(bookTitle) {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const matchingBooks = [];

        for (const key of bookKeys) {
            if (books[key].title === bookTitle) {
                matchingBooks.push(books[key]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found with title " + bookTitle);
        }
    });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let bookISBN =req.params.isbn;
    res.send(books[bookISBN].reviews);
});

function readBooksData() {
    return new Promise((resolve, reject) => {
        try {
            // Assuming books data is readily available and doesn't need to be read from a file
            resolve(books);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.general = public_users;

