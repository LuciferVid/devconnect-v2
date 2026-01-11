import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, Heart, MessageSquare, Share2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';
import api from '../services/api';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-10 bg-dark-bg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explore Projects</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover what the community is building. Find inspiration, collaborate, and share your own work.
            </p>
          </div>
        </ScrollReveal>

        {/* Search and Filter */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search projects, tags, or developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
              />
            </div>
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={18} /> Filters
            </Button>
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No projects found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <ScrollReveal key={post._id || idx} delay={0.1 * (idx % 3)}>
                <Card className="h-full flex flex-col hover:border-primary-500/30 hover:shadow-[0_0_40px_rgba(14,165,233,0.1)] transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -z-10 group-hover:bg-primary-500/10 transition-colors"></div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold overflow-hidden">
                      {post.author?.avatar ? (
                        <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                      ) : (
                        post.author?.name?.[0] || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">{post.author?.name}</h3>
                      <p className="text-xs text-gray-500 tracking-wider">@{post.author?.username}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-8 flex-grow leading-relaxed font-light line-clamp-4 text-sm">
                    {post.content}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between text-gray-500 text-xs">
                    <div className="flex gap-5">
                      <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors group/btn">
                        <Heart size={16} className="group-hover/btn:fill-red-400 transition-all" />
                        <span className="font-medium">{post.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-primary-400 transition-colors group/btn">
                        <MessageSquare size={16} className="group-hover/btn:fill-primary-400/20 transition-all" />
                        <span className="font-medium">{post.comments?.length || 0}</span>
                      </button>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Share2 size={16} />
                    </button>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
