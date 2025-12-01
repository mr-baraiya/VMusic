import { motion } from 'framer-motion';
import { X, Youtube, Zap } from 'lucide-react';

const FullscreenModal = ({ video, onClose, onPlay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
        >
          <X size={24} />
        </button>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border-2 border-red-500/30 shadow-2xl">
          <div className="aspect-video w-full bg-black relative">
            <div id="fullscreen-player" className="absolute inset-0"></div>
          </div>

          <div className="p-6 bg-gradient-to-r from-gray-900 to-black">
            <h2 className="text-2xl font-black text-white mb-2 line-clamp-2">{video.title}</h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 flex items-center gap-2">
                <Youtube size={20} className="text-red-500" />
                {video.channelTitle}
              </p>
              <button
                onClick={() => {
                  onPlay(video);
                  onClose();
                }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white text-lg font-bold transition-all flex items-center justify-center hover:scale-105"
              >
                <Zap size={32} fill="white" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FullscreenModal;
