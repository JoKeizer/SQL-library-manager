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

//post new book
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/");
  } catch (error) {
    if( error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error
    }
  }
}));


//Get update-book route
router.get(
    "/:id",
    asyncHandler(async (req, res, next) => {
      const book = await Book.findByPk(req.params.id);
      handleRenderGet("books/update-book", req, res, book, "Update Book", next);
    })
);

// function to handle rendering from any page except home page
function handleRenderGet(view, req, res, book, title, next = null) {
  try {
    if (book) {
      res.render(view, { book, title: title });
    } else {
      res.render("error-page-not-found", {});
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

/* POST update Book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  //find book
  try {

    if(isNaN(parseInt(req.params.id))) {
      throw error = {
        status: 404,
        message: "Sorry that book doesn't exist"
      }
    } else {
      book = await Book.findByPk(req.params.id);
      if(book) {
        await book.update(req.body)
        res.redirect("/");
      }
      throw error = {
        status: 500,
        message: "Looks like the book your trying to update doesn't exist"
      }
    }
  } catch (error) {
    if( error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id
      res.render("books/update-book", { book, errors: error.errors, title: "Update Books"});
    } else {
      throw error;
    }
  }

}));


/* Delete individual article. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
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
