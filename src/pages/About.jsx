import { motion } from 'framer-motion';
import { Music2, Code, Heart, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <Music2 size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">About VMusic</h1>
          <p className="text-xl text-gray-400">
            Free, independent music for everyone
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-purple-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            VMusic was built to celebrate independent artists and provide free access to incredible music. 
            We believe music should be accessible to everyone, and artists deserve to be discovered. 
            Powered by Jamendo API, we offer over 500,000 royalty-free tracks from talented musicians worldwide.
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Code className="text-blue-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Built With</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
            <div className="p-4 bg-white/5 rounded-lg">React 19</div>
            <div className="p-4 bg-white/5 rounded-lg">Vite</div>
            <div className="p-4 bg-white/5 rounded-lg">Tailwind CSS</div>
            <div className="p-4 bg-white/5 rounded-lg">Firebase</div>
            <div className="p-4 bg-white/5 rounded-lg">Framer Motion</div>
            <div className="p-4 bg-white/5 rounded-lg">Jamendo API</div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-yellow-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Features</h2>
          </div>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">✓</span>
              <span>500,000+ royalty-free tracks from independent artists</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">✓</span>
              <span>Create custom playlists and save your favorites</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">✓</span>
              <span>Discover music by genre, mood, and popularity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">✓</span>
              <span>100% legal and free - no subscriptions required</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">✓</span>
              <span>Beautiful, responsive design with smooth animations</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
