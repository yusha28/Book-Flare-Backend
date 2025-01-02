const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const user = await User.create({ name, email, password });
      if (user) {
        res.status(201).json({
          message: 'Registered successfully!',
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  