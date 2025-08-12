const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');

// Create or update profile for logged-in user
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    // ensure userId matches token user id
    data.userId = req.user.id;
    let profile = await UserProfile.findOne({ userId: req.user.id });
    if (profile) {
      // update
      profile.set(data);
      await profile.save();
      return res.json(profile);
    } else {
      profile = new UserProfile(data);
      await profile.save();
      return res.status(201).json(profile);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile for logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get public profile by id
router.get('/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete profile (owner only)
router.delete('/', auth, async (req, res) => {
  try {
    await UserProfile.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
