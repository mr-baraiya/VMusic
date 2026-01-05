import { motion } from 'framer-motion';
import { Youtube, Play, Music2, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeIn, staggerContainer, hoverScale, hoverTilt } from '../../utils/motionVariants';
// Skeleton Loading Component
const SkeletonCard = () => (
  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 animate-pulse">
    <div className="w-12 h-12 bg-gray-800 rounded-xl mb-4"></div>
    <div className="h-6 bg-gray-800 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-800 rounded w-full"></div>
    <div className="h-4 bg-gray-800 rounded w-2/3 mt-2"></div>
  </div>
);
const YouTubeSection = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative py-20 px-4 bg-gradient-to-b from-blue-950 via-black to-blue-950 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          variants={fadeIn('up', 'tween', 0.1, 0.8)}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
            <Youtube size={20} className="text-red-500" />
            <span className="text-red-400 font-medium">VibeTube Feature</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Play YouTube Music
            <br />
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience seamless YouTube music playback with our advanced player. Search, play, and
            enjoy millions of songs.
          </p>
        </motion.div>

        {/* Feature Cards */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* Card 1 */}
          <motion.div
            variants={hoverTilt}
            whileHover="whileHover"
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all h-full">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4"
              >
                <Play size={24} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Playback</h3>
              <p className="text-gray-400">
                Search and play any song from YouTube instantly with our optimized player
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={hoverTilt}
            whileHover="whileHover"
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all h-full">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4"
              >
                <Music2 size={24} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Playlist Support</h3>
              <p className="text-gray-400">
                Import and play entire YouTube playlists with a single click
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={hoverTilt}
            whileHover="whileHover"
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-pink-900/20 to-red-900/20 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all h-full">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4"
              >
                <Headphones size={24} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">High Quality Audio</h3>
              <p className="text-gray-400">
                Enjoy YouTube music in the best quality available
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          variants={fadeIn('up', 'tween', 0.5, 0.8)}
          className="text-center"
        >
          <button
            onClick={() => navigate('/vibetube')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-full shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-105"
          >
            <Youtube size={24} />
            <span>Open VibeTube Player</span>
            <Play size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-500 text-sm mt-4">
            No sign-up required • Free forever • Unlimited playback
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default YouTubeSection;
