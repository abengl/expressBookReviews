const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;

  const username = req.body.username;
  const message = req.body.message;
  const newReview = {
    name: username,
    review: message,
  };

  if (!message) {
    return res.status(404).json({ message: "Review message is empty." });
  }

  let userReviewed = false;

  for (const reviewId in reviews) {
    const review = reviews[reviewId];
    if (review.name === username) {
      review.review = message;
      userReviewed = true;
      return res.status(200).send("Review successfully updated");
    }
  }
  if (!userReviewed) {
    const reviewId = Object.keys(reviews).length + 1;
    reviews[reviewId] = newReview;
    return res.status(200).send("Review successfully added");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;

  const username = req.body.username;

  for (const reviewId in reviews) {
    if (reviews[reviewId].name === username) {
      delete reviews[reviewId];
      return res.status(200).send("Review successfully deleted");
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
