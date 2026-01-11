import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'devconnect_secret_key_123', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User with that email or username already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      username,
      password // password will be hashed by the pre-save hook
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

import axios from 'axios';

// @route   GET /api/auth/github
// @desc    Redirect to GitHub OAuth
// @access  Public
router.get('/github', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.BACKEND_URL}/api/auth/github/callback&scope=user:email`;
  res.redirect(url);
});

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth callback
// @access  Public
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Get access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;

    // 2. Get user data
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` }
    });

    const { id, login, name, email, avatar_url, bio } = userResponse.data;

    // 3. Find or create user
    let user = await User.findOne({ githubId: id.toString() });

    if (!user) {
      // Check if email already exists
      user = await User.findOne({ email: email || `${login}@github.com` });

      if (user) {
        user.githubId = id.toString();
        await user.save();
      } else {
        user = await User.create({
          name: name || login,
          email: email || `${login}@github.com`,
          username: login,
          githubId: id.toString(),
          avatar: avatar_url,
          bio: bio || '',
          password: Math.random().toString(36).slice(-10) // Random password for schema
        });
      }
    }

    // 4. Generate token and redirect
    const token = generateToken(user._id);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // Pass token and user data via query params for the frontend to store
    // safer to use a short-lived transient token or session, but for this demo redirect is fine
    res.redirect(`${clientUrl}/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar
    }))}`);

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=github_failed`);
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
