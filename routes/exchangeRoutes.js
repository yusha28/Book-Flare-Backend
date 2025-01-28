const express = require('express');
const multer = require('multer');
const router = express.Router();
const ExchangeBook = require('../models/ExchangeBook'); // MongoDB model
const { protect } = require('../middleware/authMiddleware'); // Middleware for authentication

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a timestamp
  },
});
const upload = multer({ storage });

// ** Upload a Book for Exchange **
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, author, summary, condition, price, terms } = req.body;

    // Validate required fields
    if (!title || !author || !condition || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newBook = new ExchangeBook({
      title,
      author,
      summary,
      condition,
      price,
      terms,
      image: req.file ? req.file.filename : null, // Optional image upload
      userID: req.user.id, // Associate the book with the uploader's ID
      status: 'available', // Default status
    });

    await newBook.save();
    res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
  } catch (error) {
    console.error('Error uploading book:', error.message);
    res.status(500).json({ message: 'Error uploading book', error });
  }
});

// ** Fetch All Books for Exchange **
router.get('/', protect, async (req, res) => {
  try {
    const books = await ExchangeBook.find({
      userID: { $ne: req.user.id },
      status: 'available',
    });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

// ** Fetch Books Uploaded by Logged-in User (My Exchange) **
router.get('/my-books', protect, async (req, res) => {
  try {
    const myBooks = await ExchangeBook.find({ userID: req.user.id });
    res.status(200).json(myBooks);
  } catch (error) {
    console.error('Error fetching user books:', error.message);
    res.status(500).json({ message: 'Error fetching user books', error });
  }
});

// ** Edit a Book Listing by ID **
router.put('/edit/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent modification of certain fields
    delete updates.userID;

    if (req.file) {
      updates.image = req.file.filename; // Include updated image if provided
    }

    const updatedBook = await ExchangeBook.findOneAndUpdate(
      { _id: id, userID: req.user.id },
      updates,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found or unauthorized access' });
    }

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error.message);
    res.status(500).json({ message: 'Error updating book', error });
  }
});

// ** Mark a Book as Exchanged **
router.patch('/mark-exchanged/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const book = await ExchangeBook.findOne({ _id: id, userID: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized access' });
    }

    book.status = 'exchanged';
    await book.save();

    res.status(200).json({ message: 'Book marked as exchanged', book });
  } catch (error) {
    console.error('Error marking book as exchanged:', error.message);
    res.status(500).json({ message: 'Error marking book as exchanged', error });
  }
});

// ** Delete a Book by ID **
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const book = await ExchangeBook.findOneAndDelete({ _id: id, userID: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized access' });
    }

    const updatedBooks = await ExchangeBook.find({ userID: req.user.id }); // Return updated list
    res.status(200).json({ message: 'Book deleted successfully', books: updatedBooks });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ message: 'Error deleting book', error });
  }
});

module.exports = router;
