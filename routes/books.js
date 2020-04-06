var express = require('express');
var router = express.Router();

const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

//Get all book from Database
router.get('/', asyncHandler(async(req, res) => {
  const books = await Book.findAll({
    order: [["title", "ASC"]]
  });
  res.render('books/index', {books,  title: 'New Book'});
}));

//Get new-book route
router.get('/new', asyncHandler(async(req, res) => {
  res.render('books/new-book', {book: {}, title: 'New Book'});
}));

/* POST create Book. */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect("books");
  } catch (error) {
    //show validatio
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
}));

//Get update-book route
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('books/update-book', {book: book, title: 'Book Title'});
  } else {
    res.sendStatus(404)
  }
}));

/* POST update Book. */
router.post('/:id', asyncHandler(async (req, res) => {
  //find book
  const book = await Book.findByPk(req.params.id)
  if(book) {
    //Update the database
    await book.update(req.body);
    res.redirect("/books/");
  } else {
    res.sendStatus(404)
  }
}));


/* Delete individual article. */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  //find right book ID
  const book = await Book.findByPk(req.params.id);
  console.log("ID", req.params.id)
  if(book) {
    //delete from database
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404)
  }
}));

module.exports = router;
