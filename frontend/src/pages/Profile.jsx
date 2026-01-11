import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Calendar, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ChatWindow from '../components/ChatWindow';
import ScrollReveal from '../components/ScrollReveal';
import api from '../services/api';

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('projects');
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, we'd fetch by username. 
        // For this demo, we'll try to get the current user or a mock fallback if the API isn't fully ready for public profiles
        // But let's try to hit the endpoint
        const res = await api.get(`/users/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        // Fallback for demo if API fails or user not found
        setUser({
          name: 'Sarah Chen',
          username: username || 'sarahc',
          role: 'Senior Frontend Engineer',
          bio: 'Building accessible web experiences. Core contributor to several open source projects. Love React, TypeScript, and Rust.',
          location: 'San Francisco, CA',
          website: 'sarahchen.dev',
          joined: 'January 2024',
          techStack: ['React', 'TypeScript', 'Node.js', 'Rust', 'Tailwind'],
          stats: { followers: 1234, following: 567, projects: 42 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  const projects = [
    { name: 'react-optimize-cli', desc: 'CLI tool for optimizing React builds', lang: 'TypeScript', stars: 245 },
    { name: 'dev-connect', desc: 'Social platform for developers', lang: 'JavaScript', stars: 128 },
    { name: 'rust-game-engine', desc: 'Experimental game engine in Rust', lang: 'Rust', stars: 89 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-dark-bg text-white">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 bg-dark-bg text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Card */}
        <ScrollReveal>
          <Card className="mb-8 relative overflow-visible border-primary-500/20 shadow-[0_0_50px_rgba(14,165,233,0.1)]">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-primary-400 text-4xl font-bold flex-shrink-0 border border-primary-500/30 shadow-[0_0_30px_rgba(14,165,233,0.3)] group-hover:scale-105 transition-transform duration-500">
                {user.name[0]}
              </div>
              <div className="flex-grow w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{user.name}</h1>
                    <p className="text-xl text-primary-400 font-medium">@{user.username}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowChat(true)} className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10">Message</Button>
                    <Button variant="primary" className="shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">Follow</Button>
                  </div>
                </div>

                <p className="text-lg text-gray-300 mb-6 max-w-2xl leading-relaxed font-light">
                  <span className="text-primary-300 font-medium">{user.role}</span> • {user.bio}
                </p>

                <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8 font-medium">
                  <div className="flex items-center gap-2 hover:text-primary-400 transition-colors cursor-default">
                    <MapPin size={18} className="text-primary-500" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                    <LinkIcon size={18} className="text-primary-500" />
                    <a href={`https://${user.website}`} className="hover:text-white transition-colors">{user.website}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary-500" />
                    Joined {user.joined}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.techStack?.map(tech => (
                    <span key={tech} className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-full text-sm font-medium hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-300 transition-all duration-300 cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={0.2}>
          <div className="border-b border-white/10 mb-8">
            <nav className="flex gap-8">
              {['Projects', 'Posts', 'Connections'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`
                    pb-4 px-2 text-sm font-medium border-b-2 transition-all duration-300
                    ${activeTab === tab.toLowerCase()
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-white/20'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === 'projects' && projects.map((project, i) => (
            <ScrollReveal key={i} delay={0.3 + (i * 0.1)}>
              <Card className="group cursor-pointer h-full hover:border-primary-500/30 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{project.name}</h3>
                  <span className="text-sm text-gray-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                    ★ {project.stars}
                  </span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed font-light">{project.desc}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                  <span className="text-sm text-gray-300 font-medium">{project.lang}</span>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Chat Window */}
        {showChat && <ChatWindow recipient={user} onClose={() => setShowChat(false)} />}

      </div>
    </div>
  );
};

export default Profile;
