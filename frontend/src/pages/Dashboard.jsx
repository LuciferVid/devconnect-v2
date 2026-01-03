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
    <div className="min-h-screen pt-24 pb-10 bg-dark-bg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Sidebar - Profile Snapshot */}
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-24">
              <ScrollReveal>
                <Card>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-400 mb-4 border border-primary-500/20">
                      <User size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">@{user.username}</p>
                    <div className="w-full border-t border-white/10 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Profile Views</span>
                        <span className="font-medium text-white">0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Connections</span>
                        <span className="font-medium text-white">0</span>
                      </div>
                    </div>
                    <Link to={`/profile/${user.username}`} className="w-full mt-4">
                      <Button variant="secondary" className="w-full justify-center text-sm">View Profile</Button>
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
              <Card>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex-shrink-0" />
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Share something with the community..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
                  <Button variant="primary" className="px-6" onClick={handleCreatePost}>Post</Button>
                </div>
              </Card>
            </ScrollReveal>

            {/* Posts */}
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary-500" size={32} />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No posts yet. Be the first to share something!
              </div>
            ) : (
              posts.map((post, idx) => (
                <ScrollReveal key={post._id || idx} delay={0.1}>
                  <Card>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-400 flex-shrink-0 border border-primary-500/20">
                        <span className="font-bold">{post.author?.name?.[0] || 'U'}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white">{post.author?.name || 'Unknown User'}</h4>
                          <span className="text-sm text-gray-400">@{post.author?.username || 'unknown'}</span>
                          <span className="text-sm text-gray-500">• {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-200 mb-4 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-6 text-gray-400">
                          <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                            <Heart size={18} />
                            <span className="text-sm">{post.likes?.length || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                            <MessageSquare size={18} />
                            <span className="text-sm">{post.comments?.length || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                            <Share2 size={18} />
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
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-primary-400" />
                    <h3 className="font-bold text-white">Trending Projects</h3>
                  </div>
                  <div className="space-y-4">
                    {trending.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No trending projects yet.</p>
                    ) : (
                      trending.map((item, i) => (
                        <div key={i} className="group cursor-pointer">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors">{item.name}</h4>
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">★ {item.stars}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Button variant="secondary" className="w-full mt-6 text-sm">View All</Button>
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
