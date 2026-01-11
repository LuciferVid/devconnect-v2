import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const users = [
  {
    name: "Sarah Chen",
    username: "sarahc",
    email: "sarah@example.com",
    password: "password123",
    bio: "Senior Frontend Engineer. Love React, TypeScript, and Rust.",
    role: "Senior Engineer",
    location: "San Francisco, CA",
    website: "sarahchen.dev",
    techStack: ["React", "TypeScript", "Rust", "Next.js"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Alex Rivera",
    username: "arivera",
    email: "alex@example.com",
    password: "password123",
    bio: "Full Stack Developer building scalable systems. Open source enthusiast.",
    role: "Full Stack Dev",
    location: "New York, NY",
    website: "arivera.io",
    techStack: ["Node.js", "Python", "Docker", "AWS"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    name: "Emily Zhang",
    username: "ezhang",
    email: "emily@example.com",
    password: "password123",
    bio: "UI/UX Designer & Developer. Crafting beautiful digital experiences.",
    role: "Product Designer",
    location: "Toronto, ON",
    website: "emilyz.design",
    techStack: ["Figma", "React", "Tailwind", "Three.js"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
  }
];

const posts = [
  {
    authorIdx: 0,
    content: "Just released the latest version of my React animation library! 🚀 It now supports spring physics and gesture controls. Check it out on GitHub.",
    tags: ["react", "opensource", "animation"],
    likes: 42,
    comments: 12
  },
  {
    authorIdx: 1,
    content: "Struggling with Docker networking today. Anyone have good resources for debugging container communication in a microservices architecture?",
    tags: ["docker", "devops", "help"],
    likes: 15,
    comments: 8
  },
  {
    authorIdx: 2,
    content: "Working on a new design system for our dashboard. Dark mode is hard but so rewarding when you get the colors right! 🎨 #design #uiux",
    tags: ["design", "css", "darkmode"],
    likes: 89,
    comments: 24
  },
  {
    authorIdx: 0,
    content: "Rust's borrow checker is strict but it really forces you to think about memory safety. Loving the learning curve so far.",
    tags: ["rust", "learning", "programming"],
    likes: 56,
    comments: 5
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devconnect');
    console.log('MongoDB Connected');

    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    const postsWithAuthors = posts.map(post => ({
      ...post,
      author: createdUsers[post.authorIdx]._id
    }));

    await Post.create(postsWithAuthors);
    console.log(`Created ${posts.length} posts`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
