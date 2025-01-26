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

    // Create a new book object with the logged-in user's ID
    const newBook = new ExchangeBook({
      title,
      author,
      summary,
      condition,
      price,
      terms,
      image: req.file.filename,
      userID: req.user.id, // Associate the book with the uploader's ID
      status: 'available', // Default status
    });

    // Save the book to the database
    await newBook.save();
    res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
  } catch (error) {
    console.error('Error uploading book:', error.message);
    res.status(500).json({ message: 'Error uploading book', error });
  }
});

// ** Fetch All Books for Exchange (excluding user's own books) **
router.get('/', protect, async (req, res) => {
  try {
    const books = await ExchangeBook.find({
      userID: { $ne: req.user.id }, // Exclude books uploaded by the logged-in user
      status: 'available', // Fetch only available books
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
    const myBooks = await ExchangeBook.find({ userID: req.user.id }); // Fetch books by the logged-in user
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

    // Include the updated image if provided
    if (req.file) {
      updates.image = req.file.filename;
    }

    // Find and update the book
    const updatedBook = await ExchangeBook.findOneAndUpdate(
      { _id: id, userID: req.user.id }, // Ensure only the owner can edit
      updates,
      { new: true } // Return the updated document
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

    // Find the book and ensure it belongs to the logged-in user
    const book = await ExchangeBook.findOne({ _id: id, userID: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized access' });
    }

    // Update the status of the book
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

    // Find the book and ensure it belongs to the logged-in user
    const book = await ExchangeBook.findOneAndDelete({ _id: id, userID: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized access' });
    }

    res.status(200).json({ message: 'Book deleted successfully', book });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ message: 'Error deleting book', error });
  }
});

module.exports = router;
