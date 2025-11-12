import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Music2, 
  Heart, 
  ListMusic, 
  TrendingUp, 
  Play,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useEffect, useState } from 'react';
import jamendoAPI from '../api/jamendo';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { playTrack } = usePlayer();
  const navigate = useNavigate();
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      try {
        const data = await jamendoAPI.getTrendingTracks(6);
        setTrendingTracks(data.results || []);
      } catch (error) {
        console.error('Error fetching trending tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTracks();
  }, []);

  const quickStats = [
    { label: 'Favorite Tracks', value: '0', icon: Heart, color: 'from-pink-500 to-rose-500', link: '/favorites' },
    { label: 'Playlists', value: '0', icon: ListMusic, color: 'from-purple-500 to-indigo-500', link: '/playlists' },
    { label: 'Recently Played', value: '0', icon: Clock, color: 'from-blue-500 to-cyan-500', link: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-blue-900/40 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center border-4 border-white/20 shadow-xl">
                  <span className="text-3xl font-bold text-white">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Music Lover'}!
                </h1>
                <p className="text-gray-300 text-lg flex items-center gap-2">
                  <Sparkles size={20} className="text-yellow-400" />
                  Ready to discover amazing music?
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {quickStats.map((stat, index) => (
            <motion.button
              key={stat.label}
              onClick={() => navigate(stat.link)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
              <div className="relative flex items-center justify-between">
                <div className="text-left">
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon size={28} className="text-white" />
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-900/50 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Explore Music</h3>
                <p className="text-green-100 text-sm">Discover trending tracks</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/playlists')}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-900/50 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ListMusic size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Create Playlist</h3>
                <p className="text-purple-100 text-sm">Organize your favorite tracks</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Trending Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-green-400" />
              Trending Now
            </h2>
            <button
              onClick={() => navigate('/explore')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                  <div className="w-full aspect-square bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="group relative bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all border border-white/10 hover:border-white/20 cursor-pointer"
                  onClick={() => navigate(`/track/${track.id}`)}
                >
                  {/* Album Art */}
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={track.image || 'https://via.placeholder.com/300'}
                      alt={track.name}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(track, trendingTracks);
                        }}
                        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all shadow-lg"
                      >
                        <Play size={24} className="text-white ml-1" fill="white" />
                      </button>
                    </div>
                  </div>

                  {/* Track Info */}
                  <h3 className="text-white font-semibold mb-1 truncate group-hover:text-green-400 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
                  
                  {/* Duration */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {jamendoAPI.formatDuration(track.duration)}
                    </span>
                    <button className="text-gray-400 hover:text-pink-500 transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State Message */}
        {!loading && trendingTracks.length === 0 && (
          <div className="text-center py-12">
            <Music2 size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No trending tracks available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
