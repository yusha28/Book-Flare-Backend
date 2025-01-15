const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { upload, cloudinary } = require('../config/db');

// Fetch all books with optional search and genre filter
router.get('/', async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    // Add search query for title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive title search
        { author: { $regex: search, $options: 'i' } }, // Case-insensitive author search
      ];
    }

    // Add genre filter if provided
    if (genre) {
      query.genre = genre;
    }

    const books = await Book.find(query);
    res.status(200).json(books); // Respond with matching books
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
});

// Fetch a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error.message);
    res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
});

// Add a new book with an optional image uploaded to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, author, price, genre, summary } = req.body;

    console.log('Incoming Request:', req.body);
    console.log('Uploaded File:', req.file);

    // Upload image to Cloudinary if provided
    let imageUrl = '';
    if (req.file) {
      console.log('Uploading to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bookstore/books',
      });
      imageUrl = result.secure_url;
      console.log('Uploaded Image URL:', imageUrl);
    }

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      price,
      genre,
      summary,
      image: imageUrl,
    });

    const savedBook = await newBook.save();
    console.log('Book saved successfully:', savedBook);
    res.status(201).json(savedBook); // Respond with the created book
  } catch (error) {
    console.error('Error saving book:', error.message);
    res.status(500).json({ message: 'Failed to save book', error: error.message });
  }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
});

module.exports = router;
