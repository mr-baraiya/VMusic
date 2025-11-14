import { motion } from 'framer-motion';
import { Youtube, Sparkles } from 'lucide-react';

const VibeTubeHeader = ({ onSearch, isLoading, SearchBarComponent }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-900/40 via-pink-900/40 to-purple-900/40 border-b border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Youtube size={56} className="text-red-500" />
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent">
              VibeTube
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={36} className="text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-gray-300 text-xl font-medium">Stream Millions of Music Videos in Stunning Quality</p>
        </motion.div>

        <SearchBarComponent onSearch={onSearch} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default VibeTubeHeader;
