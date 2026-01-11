import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Users, MessageSquare, ArrowRight, Code2, Cpu, Globe, CheckCircle, Zap, Shield } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import ScrollReveal from '../components/ScrollReveal';
import SpaceBackground from '../components/SpaceBackground';
import LiveTerminal from '../components/LiveTerminal';
import api from '../services/api';

const Landing = () => {
  const [stats, setStats] = useState({
    developers: 0,
    projects: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          api.get('/users'),
          api.get('/posts')
        ]);

        setStats(prev => ({
          ...prev,
          developers: usersRes.data.length || 0,
          projects: postsRes.data.totalPosts || 0
        }));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden text-white selection:bg-primary-500/30">
      <SpaceBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-primary-300 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              New features are live
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
              Connect with Developers <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-200 to-white">
                Build the Future
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Join a professional community of developers. Share projects, collaborate on open source, and advance your career with the world's top talent.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button variant="primary" className="text-base px-8 py-4 h-auto shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_60px_rgba(14,165,233,0.5)]">
                  Get Started <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" className="text-base px-8 py-4 h-auto">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to grow</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Powerful features to help you connect, collaborate, and create amazing software.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Code2 size={24} />,
                title: "Share Projects",
                desc: "Showcase your work to a global audience of developers and get recognized."
              },
              {
                icon: <Users size={24} />,
                title: "Collaborate",
                desc: "Find partners for your next hackathon, side project, or startup idea."
              },
              {
                icon: <MessageSquare size={24} />,
                title: "Get Feedback",
                desc: "Receive constructive feedback from the community to improve your skills."
              }
            ].map((feature, idx) => (
              <ScrollReveal key={idx} delay={0.2 + (idx * 0.1)} className="h-full">
                <Card className="h-full bg-white/5 hover:bg-white/10 border-white/5 hover:border-primary-500/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-6 text-primary-400 border border-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How DevConnect Works</h2>
              <div className="space-y-8">
                {[
                  { title: "Create your profile", desc: "Showcase your tech stack, GitHub stats, and portfolio." },
                  { title: "Connect with peers", desc: "Find developers with similar interests and complementary skills." },
                  { title: "Launch projects", desc: "Team up and build the next big thing together." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="relative group">
                <div className="absolute inset-x-0 -bottom-10 h-40 bg-primary-500/10 blur-[100px] rounded-full group-hover:bg-primary-500/20 transition-all duration-500"></div>
                <LiveTerminal />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-white/10 pt-16">
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-8 text-center max-w-2xl mx-auto">
              {[
                { label: "Developers", value: stats.developers },
                { label: "Projects", value: stats.projects },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-500 uppercase text-sm tracking-wider font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

      </div>
    </div>
  );
};

export default Landing;
