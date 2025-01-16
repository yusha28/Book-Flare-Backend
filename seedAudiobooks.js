const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Audiobook = require('./models/Audiobook');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const audiobooks = [
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    price: 500,
    description: 'A classic gothic novel exploring human ambition and morality.',
    image: '/uploads/Book2.jpg',
    chapters: [
      { title: 'Introduction', audioSrc: '/audio/frankenstein/chapter1.mp3' },
      { title: 'Chapter 1', audioSrc: '/audio/frankenstein/chapter2.mp3' },
    ],
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 450,
    description: 'A spiritual journey of a shepherd boy pursuing his dreams.',
    image: '/uploads/the_alchemist.jpg',
    chapters: [
      { title: 'Introduction', audioSrc: '/audio/the_alchemist/chapter1.mp3' },
      { title: 'Chapter 1', audioSrc: '/audio/the_alchemist/chapter2.mp3' },
    ],
  },
];

const seedData = async () => {
  try {
    await Audiobook.deleteMany();
    console.log('Existing audiobooks deleted.');
    await Audiobook.insertMany(audiobooks);
    console.log('Audiobooks seeded successfully.');
    process.exit();
  } catch (err) {
    console.error('Error seeding audiobooks:', err);
    process.exit(1);
  }
};

seedData();
