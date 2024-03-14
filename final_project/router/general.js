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
public_users.get("/",(req,res)=>{
    res.send(JSON.stringify(books,null,4));
  });
  
  // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName =req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  for (const key of bookKeys) {
    if (books[key].author === authorName) {
      matchingBooks.push(books[key]);
    }
  }
  res.send(JSON.stringify(matchingBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookTitle =req.params.title;
    let bookKeys = Object.keys(books);
    let matchingBooks = [];
  
    for (let key of bookKeys) {
      if (books[key].title === bookTitle) {
        matchingBooks.push(books[key]);
      }
    }
    res.send(JSON.stringify(matchingBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let bookISBN =req.params.isbn;
    res.send(books[bookISBN].reviews);
});

module.exports.general = public_users;
