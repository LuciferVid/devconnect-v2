import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

const users = [
  {
    name: "Sarah Chen",
    username: "sarahc",
    email: "sarah@example.com",
    password: "password123",
    bio: "Senior Frontend Engineer. Love React, TypeScript, and Rust."
  },
  {
    name: "Alex Rivera",
    username: "arivera",
    email: "alex@example.com",
    password: "password123",
    bio: "Full Stack Developer building scalable systems. Open source enthusiast."
  },
  {
    name: "Emily Zhang",
    username: "ezhang",
    email: "emily@example.com",
    password: "password123",
    bio: "UI/UX Designer & Developer. Crafting beautiful digital experiences."
  }
];

const posts = [
  {
    authorIdx: 0,
    title: "React Animation Library v2.0",
    content: "Just released v2.0 of my React animation library! 🚀 It now supports spring physics and gesture controls. Check it out on GitHub.",
    tags: ["react", "animation"]
  },
  {
    authorIdx: 1,
    title: "Docker Networking Help",
    content: "Struggling with Docker networking today. Anyone have good resources for debugging container communication in a microservices architecture?",
    tags: ["docker", "devops"]
  },
  {
    authorIdx: 2,
    title: "New Design System",
    content: "Working on a new design system for our dashboard. Dark mode is hard but so rewarding when you get the colors right! 🎨 #design #uiux",
    tags: ["design", "uiux"]
  },
  {
    authorIdx: 0,
    title: "Learning Rust",
    content: "Rust's borrow checker is strict but it really forces you to think about memory safety. Loving the learning curve so far.",
    tags: ["rust", "programming"]
  }
];

const seed = async () => {
  try {
    console.log('Starting seed...');
    const tokens = [];

    // 1. Register/Login Users
    for (const user of users) {
      try {
        const res = await axios.post(`${API_URL}/auth/register`, user);
        tokens.push(res.data.token);
        console.log(`Registered ${user.username}`);
      } catch (err) {
        if (err.response?.status === 400 || err.response?.status === 500) {
          // If 500, it might be because the user already exists in the in-memory DB but registration failed previously
          console.log(`User ${user.username} might exist, trying login...`);
          try {
            const res = await axios.post(`${API_URL}/auth/login`, { email: user.email, password: user.password });
            tokens.push(res.data.token);
            console.log(`Logged in ${user.username}`);
          } catch (loginErr) {
            console.error(`Failed to register/login ${user.username}:`, loginErr.response?.data?.message || loginErr.message);
            tokens.push(null);
          }
        } else {
          console.error(`Failed to register ${user.username}:`, err.response?.data?.message || err.message);
          tokens.push(null);
        }
      }
    }

    // 2. Create Posts
    for (const post of posts) {
      const token = tokens[post.authorIdx];
      if (!token) continue;

      try {
        await axios.post(`${API_URL}/posts`,
          {
            title: post.title,
            content: post.content,
            tags: post.tags
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Created post: ${post.title}`);
      } catch (err) {
        console.error(`Failed to create post "${post.title}":`, err.response?.data?.message || err.message);
      }
    }

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seed failed:', err.message);
  }
};

seed();
