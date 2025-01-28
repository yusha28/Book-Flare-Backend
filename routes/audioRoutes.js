const express = require('express');
const path = require('path');
const router = express.Router();
const Audiobook = require('../models/Audiobook');

// Fetch all audiobooks
router.get('/', async (req, res) => {
  try {
    const audiobooks = await Audiobook.find();
    // Update image paths to include proper protocol and host
    audiobooks.forEach((audiobook) => {
      if (audiobook.image) {
        audiobook.image = `${req.protocol}://${req.get('host')}/uploads/${path.basename(audiobook.image)}`;
      }
    });
    res.status(200).json(audiobooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audiobooks', error });
  }
});

// Fetch a single audiobook by ID
router.get('/:id', async (req, res) => {
  try {
    const audiobook = await Audiobook.findById(req.params.id);

    if (!audiobook) {
      return res.status(404).json({ message: 'Audiobook not found' });
    }

    // Update image path
    if (audiobook.image) {
      audiobook.image = `${req.protocol}://${req.get('host')}/uploads/${path.basename(audiobook.image)}`;
    }

    // Update chapter audio paths
    if (audiobook.chapters && audiobook.chapters.length > 0) {
      audiobook.chapters = audiobook.chapters.map((chapter) => ({
        title: chapter.title,
        audioSrc: `${req.protocol}://${req.get('host')}/uploads/${path.basename(chapter.audioSrc)}`,
      }));
    }

    res.status(200).json(audiobook);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audiobook details', error });
  }
});

module.exports = router;
