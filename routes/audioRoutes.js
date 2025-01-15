const express = require('express');
const router = express.Router();
const Audiobook = require('../models/Audiobook');

// Fetch all audiobooks
router.get('/', async (req, res) => {
  try {
    const audiobooks = await Audiobook.find();
    res.status(200).json(audiobooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audiobooks', error: error.message });
  }
});

// Fetch a single audiobook by ID
router.get('/:id', async (req, res) => {
  try {
    const audiobook = await Audiobook.findById(req.params.id);
    if (!audiobook) {
      return res.status(404).json({ message: 'Audiobook not found' });
    }
    res.status(200).json(audiobook);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audiobook details', error: error.message });
  }
});

// Add a new audiobook
router.post('/', async (req, res) => {
  try {
    const { title, author, price, description, image, chapters } = req.body;

    const newAudiobook = new Audiobook({
      title,
      author,
      price,
      description,
      image,
      chapters,
    });

    const savedAudiobook = await newAudiobook.save();
    res.status(201).json(savedAudiobook);
  } catch (error) {
    res.status(500).json({ message: 'Error saving audiobook', error: error.message });
  }
});

module.exports = router;
