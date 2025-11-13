import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Music2, 
  Heart, 
  ListMusic, 
  TrendingUp, 
  Play,
  Clock,
  Sparkles,
  Flame,
  Star,
  Zap,
  Radio,
  Disc3,
  Users,
  Album,
  Trophy,
  Music
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
  const [popularTracks, setPopularTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [latestAlbums, setLatestAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch trending tracks
        const trendingData = await jamendoAPI.getTrendingTracks(6);
        setTrendingTracks(trendingData.results || []);

        // Fetch popular tracks
        const popularData = await jamendoAPI.getPopularTracks(8);
        setPopularTracks(popularData.results || []);

        // Fetch top artists
        const artistsData = await jamendoAPI.getTopArtists(6);
        setTopArtists(artistsData.results || []);

        // Fetch latest albums
        const albumsData = await jamendoAPI.getLatestAlbums(6);
        setLatestAlbums(albumsData.results || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const quickStats = [
    { 
      label: 'Favorite Tracks', 
      value: '0', 
      icon: Heart, 
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
      glow: 'shadow-pink-500/50',
      link: '/favorites' 
    },
    { 
      label: 'Playlists', 
      value: '0', 
      icon: ListMusic, 
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/50',
      link: '/playlists' 
    },
    { 
      label: 'Recently Played', 
      value: '0', 
      icon: Clock, 
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      glow: 'shadow-blue-500/50',
      link: '#' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black pb-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-pink-600/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
          >
            {/* Avatar with Enhanced Styling */}
            <motion.div 
              className="relative inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  className="relative w-28 h-28 rounded-full border-4 border-white/30 shadow-2xl ring-4 ring-purple-500/30"
                />
              ) : (
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center border-4 border-white/30 shadow-2xl ring-4 ring-purple-500/30">
                  <span className="text-5xl font-bold text-white">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <motion.div
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-2 shadow-lg"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={20} className="text-white" />
              </motion.div>
            </motion.div>

            {/* Welcome Text */}
            <motion.h1 
              className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{currentUser?.displayName?.split(' ')[0] || 'Music Lover'}</span>!
            </motion.h1>
            
            <motion.p 
              className="text-gray-300 text-xl flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Disc3 size={24} className="text-purple-400" />
              </motion.span>
              Ready to discover amazing music?
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame size={24} className="text-orange-400" />
              </motion.span>
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats - Enhanced Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {quickStats.map((stat, index) => (
            <motion.button
              key={stat.label}
              onClick={() => navigate(stat.link)}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all group shadow-2xl"
            >
              {/* Animated Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              {/* Glow Effect */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity`}></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="relative flex items-center justify-between">
                <div className="text-left">
                  <motion.p 
                    className="text-gray-400 text-sm mb-2 font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {stat.label}
                  </motion.p>
                  <motion.p 
                    className="text-5xl font-black text-white group-hover:scale-110 transition-transform"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  className={`w-16 h-16 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-2xl ${stat.glow} group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}
                  whileHover={{ rotate: 180 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <stat.icon size={32} className="text-white" strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Progress Bar */}
              <motion.div 
                className="relative h-2 bg-white/10 rounded-full mt-4 overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <motion.div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                  initial={{ width: '0%' }}
                  animate={{ width: '0%' }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

        {/* Quick Actions - Revamped */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-yellow-400" size={28} />
            <h2 className="text-3xl font-black text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              onClick={() => navigate('/explore')}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden flex items-center gap-6 p-8 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl transition-all shadow-2xl shadow-green-900/50 group border border-green-400/30"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] animate-pulse"></div>
              </div>
              
              <motion.div 
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <TrendingUp size={32} className="text-white" strokeWidth={2.5} />
              </motion.div>
              <div className="text-left relative z-10">
                <h3 className="text-2xl font-black text-white mb-1">Explore Music</h3>
                <p className="text-green-100 text-sm font-medium">Discover trending tracks & new artists</p>
              </div>
              
              {/* Arrow Icon */}
              <motion.div
                className="absolute right-6 text-white/50 group-hover:text-white group-hover:right-4 transition-all"
                initial={{ x: 0 }}
                whileHover={{ x: 10 }}
              >
                <Star size={24} />
              </motion.div>
            </motion.button>

            <motion.button
              onClick={() => navigate('/playlists')}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden flex items-center gap-6 p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-3xl transition-all shadow-2xl shadow-purple-900/50 group border border-purple-400/30"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTUiIHk9IjE1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IndoaXRlIi8+PC9zdmc+')] animate-pulse"></div>
              </div>
              
              <motion.div 
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <ListMusic size={32} className="text-white" strokeWidth={2.5} />
              </motion.div>
              <div className="text-left relative z-10">
                <h3 className="text-2xl font-black text-white mb-1">Create Playlist</h3>
                <p className="text-purple-100 text-sm font-medium">Organize your favorite tracks</p>
              </div>
              
              {/* Arrow Icon */}
              <motion.div
                className="absolute right-6 text-white/50 group-hover:text-white group-hover:right-4 transition-all"
                initial={{ x: 0 }}
                whileHover={{ x: 10 }}
              >
                <Radio size={24} />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Trending Tracks - Ultra Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="text-orange-500" size={32} />
              </motion.div>
              <h2 className="text-4xl font-black text-white">Trending Now</h2>
            </div>
            <motion.button
              onClick={() => navigate('/explore')}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all shadow-lg shadow-purple-900/50 flex items-center gap-2"
            >
              View All 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="bg-white/5 backdrop-blur-sm rounded-3xl p-5 animate-pulse border border-white/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-full aspect-square bg-white/10 rounded-2xl mb-4"></div>
                  <div className="h-5 bg-white/10 rounded-full w-3/4 mb-3"></div>
                  <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.7 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 backdrop-blur-xl rounded-3xl p-5 transition-all border border-white/20 hover:border-white/40 cursor-pointer shadow-2xl hover:shadow-purple-900/50"
                  onClick={() => navigate(`/track/${track.id}`)}
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 rounded-3xl transition-all duration-500"></div>
                  
                  {/* Album Art with Enhanced Styling */}
                  <div className="relative mb-5 overflow-hidden rounded-2xl shadow-2xl">
                    <motion.img
                      src={track.image || 'https://via.placeholder.com/300'}
                      alt={track.name}
                      className="w-full aspect-square object-cover"
                      whileHover={{ scale: 1.15, rotate: 2 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Play Button Overlay */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(track, trendingTracks);
                        }}
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center hover:shadow-2xl hover:shadow-green-500/50 transition-all backdrop-blur-sm border-2 border-white/20"
                      >
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </motion.button>
                    </motion.div>

                    {/* Trending Badge */}
                    <motion.div 
                      className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center gap-1 backdrop-blur-sm border border-white/20 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    >
                      <Flame size={14} className="text-white" />
                      <span className="text-xs font-bold text-white">#{index + 1}</span>
                    </motion.div>
                  </div>

                  {/* Track Info with Enhanced Typography */}
                  <div className="relative space-y-2">
                    <motion.h3 
                      className="text-white font-bold text-lg truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all"
                      whileHover={{ x: 5 }}
                    >
                      {track.name}
                    </motion.h3>
                    <p className="text-gray-400 text-sm truncate flex items-center gap-2">
                      <Music2 size={14} className="text-purple-400" />
                      {track.artist_name}
                    </p>
                    
                    {/* Duration and Favorite */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {jamendoAPI.formatDuration(track.duration)}
                      </span>
                      <motion.button 
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-pink-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-3xl"></div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Popular This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="text-yellow-500" size={32} />
              </motion.div>
              <h2 className="text-4xl font-black text-white">Popular This Week</h2>
            </div>
            <motion.button
              onClick={() => navigate('/explore')}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-900/50 flex items-center gap-2"
            >
              View All 
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                →
              </motion.span>
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 animate-pulse">
                  <div className="w-full aspect-square bg-white/10 rounded-xl mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-yellow-400/50 cursor-pointer transition-all shadow-xl"
                  onClick={() => navigate(`/track/${track.id}`)}
                >
                  <div className="relative mb-3 overflow-hidden rounded-xl">
                    <img
                      src={track.image || 'https://via.placeholder.com/200'}
                      alt={track.name}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); playTrack(track, popularTracks); }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-xl"
                      >
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                      </motion.button>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 rounded-full text-xs font-bold text-white">
                      #{index + 1}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-sm truncate mb-1">{track.name}</h3>
                  <p className="text-gray-400 text-xs truncate">{track.artist_name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Artists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Users className="text-purple-400" size={32} />
              </motion.div>
              <h2 className="text-4xl font-black text-white">Top Artists</h2>
            </div>
            <motion.button
              onClick={() => navigate('/artists')}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-full transition-all shadow-lg shadow-purple-900/50 flex items-center gap-2"
            >
              View All 
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                →
              </motion.span>
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-full aspect-square bg-white/10 rounded-full mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {topArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="group text-center cursor-pointer"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <div className="relative mb-4 mx-auto w-full aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity"></div>
                    <img
                      src={artist.image || 'https://via.placeholder.com/200'}
                      alt={artist.name}
                      className="relative w-full h-full rounded-full object-cover border-4 border-white/20 group-hover:border-purple-400/50 transition-all shadow-2xl"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-full flex items-end justify-center pb-4 transition-opacity"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <Star size={24} className="text-yellow-400" fill="currentColor" />
                    </motion.div>
                  </div>
                  <h3 className="text-white font-bold text-sm truncate px-2 group-hover:text-purple-400 transition-colors">{artist.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">Artist</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Latest Albums */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotateY: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Album className="text-cyan-400" size={32} />
              </motion.div>
              <h2 className="text-4xl font-black text-white">Latest Albums</h2>
            </div>
            <motion.button
              onClick={() => navigate('/explore')}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-full transition-all shadow-lg shadow-cyan-900/50 flex items-center gap-2"
            >
              View All 
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                →
              </motion.span>
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 animate-pulse">
                  <div className="w-full aspect-square bg-white/10 rounded-xl mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {latestAlbums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-cyan-400/50 cursor-pointer transition-all shadow-xl"
                  onClick={() => navigate(`/album/${album.id}`)}
                >
                  <div className="relative mb-3 overflow-hidden rounded-xl">
                    <img
                      src={album.image || 'https://via.placeholder.com/200'}
                      alt={album.name}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.div
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-xl"
                      >
                        <Music size={24} className="text-white" />
                      </motion.div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 rounded-full text-xs font-bold text-white">
                      NEW
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-sm truncate mb-1 group-hover:text-cyan-400 transition-colors">{album.name}</h3>
                  <p className="text-gray-400 text-xs truncate">{album.artist_name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State Message */}
        {!loading && trendingTracks.length === 0 && (
          <div className="text-center py-12 mt-16">
            <Music2 size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No music content available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
