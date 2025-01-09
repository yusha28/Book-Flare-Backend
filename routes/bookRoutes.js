const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { upload, cloudinary } = require('../config/db');

// Fetch all books with search and filter
router.get('/books', async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    // If search query exists, filter by title or author
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },  // Case-insensitive title search
          { author: { $regex: search, $options: 'i' } }  // Case-insensitive author search
        ]
      };
    }

    // If genre is provided, filter by genre
    if (genre) {
      query.genre = genre;
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books', error: error.message || 'Unknown error' });
  }
});

// Fetch single book by ID
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.warn(`Book not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ message: 'Error fetching book details', error: error.message || 'Unknown error' });
  }
});

// Upload Book with Image to Cloudinary
router.post('/books', upload.single('image'), async (req, res) => {
  const { title, author, price, genre, summary } = req.body;

  console.log('Incoming Request:', req.body);
  console.log('Uploaded File:', req.file);

  try {
    let imageUrl = '';

    if (req.file) {
      console.log('Uploading to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bookstore/books',
      });
      imageUrl = result.secure_url;
      console.log('Uploaded Image URL:', imageUrl);
    } else {
      console.warn('No image file provided in request.');
    }

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
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Failed to save book', error: error.message || 'Unknown error' });
  }
});

// Delete Book by ID
router.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
});

module.exports = router;
