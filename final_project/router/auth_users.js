const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
    let usersWithSameName = users.filter((user)=>{
        return user.username === username
      });
      if(usersWithSameName.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 3600 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let bookISBN = req.params.isbn;
    let bookReview = req.body.review;
    const loggedInUser = req.session.authorization.username;
    
    if (!books[bookISBN]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has been write a review
    const existingReviewIndex = books[bookISBN].reviews.findIndex(review => review.user === loggedInUser);

    if (existingReviewIndex !== -1) {
        // Replace the last review
        books[bookISBN].reviews[existingReviewIndex].review = bookReview;
    } else {
        // Add a new review
        books[bookISBN].reviews.push({ user: loggedInUser, review: bookReview });
    }

    // Filter the review's user.
    const reviewsUser = books[bookISBN].reviews.filter(review => review.user === loggedInUser);

    res.send(reviewsUser);
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    let bookISBN = req.params.isbn;
    const loggedInUser = req.session.authorization.username;
    
    if (!books[bookISBN]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has been write a review
    const existingReviewIndex = books[bookISBN].reviews.findIndex(review => review.user === loggedInUser);

    if (existingReviewIndex !== -1) {
        // Replace the last review
        books[bookISBN].reviews.splice(existingReviewIndex, 1);
        return res.status(200).send("The review has been deleted.");
    } else {
        return res.status(404).json({ message: "The user has not written a review for book "+ bookISBN});
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


