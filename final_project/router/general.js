const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Task 6: POST to register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        username: username,
        password: password,
      });
      return res.status(200).json({
        message: "User successfully registred. Now you can login",
      });
    } else {
      return res.status(404).json({
        message: "User already exists!",
      });
    }
  }
  return res.status(404).json({
    message: "Unable to register user.",
  });
});

//Task 1: GET the book list available in the shop
//Task 10: GET the book list using Promise callbacks
public_users.get("/", function (req, res) {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books, null, 4));
    }, 1000);
  })
    .then((books) => {
      res.send(books);
    })
    .catch((error) => {
      res.status(500).send("Error retrieving book list");
    });
});

//Task 2:  GET book details based on ISBN
//Task 11: GET book details using Promise callbacks
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookDetails = books[isbn];
      if (bookDetails) {
        resolve(bookDetails);
      } else {
        reject("Book not found.");
      }
    }, 1000);
  })
    .then((bookDetails) => {
      res.send(bookDetails);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

//Task 3: GET book details based on author
//Task 12: GET book details by author using Promise callbacks
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      const matching_author = [];

      for (let key in books) {
        if (books[key].author === author) {
          matching_author.push(books[key]);
        }
      }

      resolve(matching_author);
    }, 1000);
  })
    .then((matching_author) => {
      res.send(matching_author);
    })
    .catch((error) => {
      res.status(500).send("Error retrieving book details");
    });
});

//Task 4: GET books based on title
//Task 13: GET book by title using Promise callbacks

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      const matching_books = [];

      for (let key in books) {
        if (books[key].title === title) {
          matching_books.push(books[key]);
        }
      }
      resolve(matching_books);
    }, 1000);
  })
    .then((matching_books) => {
      res.send(matching_books);
    })
    .catch((error) => {
      res.status(500).send("Error retrieving books");
    });
});

//Task 5: GET book reviews by ISBN
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
