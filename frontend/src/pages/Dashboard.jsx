import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, TrendingUp, MessageSquare, Heart, Share2, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';
import api from '../services/api';

const Dashboard = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'Guest', username: 'guest' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      const res = await api.post('/posts', { content: newPostContent });
      setPosts([res.data, ...posts]);
      setNewPostContent('');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const trending = []; // To be populated from API later

  return (
    <div className="min-h-screen pt-24 pb-10 bg-dark-bg text-white relative">
      <div className="absolute inset-0 bg-primary-900/5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Sidebar - Profile Snapshot */}
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-24">
              <ScrollReveal>
                <Card className="border-primary-500/10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-primary-400 mb-4 border border-primary-500/20 shadow-lg">
                      <User size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">@{user.username}</p>
                    <div className="w-full border-t border-white/5 pt-4">
                      <div className="flex justify-between text-sm mb-2 hover:text-primary-400 transition-colors cursor-default">
                        <span className="text-gray-400">Profile Views</span>
                        <span className="font-medium text-white">0</span>
                      </div>
                      <div className="flex justify-between text-sm hover:text-primary-400 transition-colors cursor-default">
                        <span className="text-gray-400">Connections</span>
                        <span className="font-medium text-white">0</span>
                      </div>
                    </div>
                    <Link to={`/profile/${user.username}`} className="w-full mt-4">
                      <Button variant="secondary" className="w-full justify-center text-sm backdrop-blur-md bg-white/5 border-white/10">View Profile</Button>
                    </Link>
                  </div>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Center - Feed */}
          <div className="md:col-span-6 space-y-6">
            {/* Create Post Input */}
            <ScrollReveal delay={0.1}>
              <Card className="border-primary-500/10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-500/10 rounded-full flex-shrink-0 flex items-center justify-center text-primary-400 border border-primary-500/20 font-bold">
                    {user.name[0]}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Share something with the developer community..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-lg py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
                  <Button variant="primary" className="px-8 shadow-[0_0_20px_rgba(14,165,233,0.2)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]" onClick={handleCreatePost}>Post</Button>
                </div>
              </Card>
            </ScrollReveal>

            {/* Posts */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary-500" size={40} />
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center py-20 border-white/5 bg-white/[0.02]">
                <div className="text-gray-500 italic">No posts yet. Be the first to share something!</div>
              </Card>
            ) : (
              posts.map((post, idx) => (
                <ScrollReveal key={post._id || idx} delay={0.1}>
                  <Card className="border-white/5 hover:border-primary-500/30 transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-primary-400 flex-shrink-0 border border-primary-500/20 font-bold shadow-sm">
                        {post.author?.name?.[0] || 'U'}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{post.author?.name || 'Unknown User'}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-primary-500/70 font-mono">@{post.author?.username || 'unknown'}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">• {new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed font-light text-base">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-8 text-gray-400 pt-4 border-t border-white/5">
                          <button className="flex items-center gap-2 hover:text-red-500 transition-all group/btn">
                            <Heart size={18} className="group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs font-mono">{post.likes?.length || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-primary-400 transition-all group/btn">
                            <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs font-mono">{post.comments?.length || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-green-500 transition-all group/btn">
                            <Share2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))
            )}
          </div>

          {/* Right Sidebar - Trending */}
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-24">
              <ScrollReveal delay={0.2}>
                <Card className="border-primary-500/10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
                      <TrendingUp size={18} className="text-primary-400" />
                    </div>
                    <h3 className="font-bold text-white tracking-tight uppercase text-xs tracking-[0.2em]">Trending Projects</h3>
                  </div>
                  <div className="space-y-6">
                    {trending.length === 0 ? (
                      <p className="text-xs text-gray-500 italic font-light">Scanning network for trending repositories...</p>
                    ) : (
                      trending.map((item, i) => (
                        <div key={i} className="group cursor-pointer">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm text-gray-200 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{item.name}</h4>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-primary-400 font-mono">★ {item.stars}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">{item.desc}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Button variant="secondary" className="w-full mt-8 text-xs uppercase tracking-widest backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10">Explore All</Button>
                </Card>
              </ScrollReveal>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
