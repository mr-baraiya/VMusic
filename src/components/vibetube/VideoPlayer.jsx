import { motion } from 'framer-motion';
import {
  Music2,
  Youtube,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react';

// Component: NowPlaying - Audio Only with Thumbnail
const NowPlaying = ({ currentTrack }) => {
  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', duration: 1 }}
          className="relative mb-6"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
            <Music2 size={48} className="text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-600 rounded-full animate-ping opacity-20"></div>
        </motion.div>
        <h3 className="text-2xl font-black text-white mb-2">Ready to Rock? 🎵</h3>
        <p className="text-gray-400 text-center">Search and play any music you love!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Album Art Section - Horizontal on mobile, vertical on desktop */}
      <div className="relative flex flex-row lg:flex-col items-center lg:justify-center p-4 sm:p-6 gap-4 lg:flex-1">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative group w-24 h-24 sm:w-32 sm:h-32 lg:w-full lg:max-w-xs lg:h-auto flex-shrink-0"
        >
          <div className="w-full aspect-square rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-2 lg:border-4 border-white/10">
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>
          {/* Floating decorative elements - hide on small mobile */}
          <div className="hidden sm:block absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <div
            className="hidden sm:block absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-60 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </motion.div>

        {/* Track Info - Beside image on mobile, below on desktop */}
        <div className="flex-1 lg:text-center min-w-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm sm:text-base lg:text-2xl xl:text-3xl font-black mb-1 lg:mb-3 line-clamp-2 bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent"
          >
            {currentTrack.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xs sm:text-sm lg:text-base flex items-center lg:justify-center gap-2"
          >
            <Youtube size={14} className="lg:w-[18px] lg:h-[18px] text-red-500 flex-shrink-0" />
            <span className="truncate">{currentTrack.channelTitle}</span>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

// Component: Player Controls
const PlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  isRepeat,
  isShuffle,
  onToggleRepeat,
  onToggleShuffle,
}) => {
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime || 0}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-red-400"
          aria-label="Seek video"
          style={{
            background: `linear-gradient(to right, rgb(239 68 68) 0%, rgb(239 68 68) ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button
          onClick={onToggleShuffle}
          className={`p-2 rounded-full transition-colors ${
            isShuffle ? 'text-red-400 bg-red-400/20' : 'text-gray-400 hover:text-white'
          }`}
          aria-label="Toggle shuffle"
          title="Shuffle"
        >
          <Shuffle size={18} className="sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={onPrevious}
          className="p-2 sm:p-3 text-white hover:text-red-400 transition-all hover:scale-110"
          aria-label="Previous video"
        >
          <SkipBack size={24} className="sm:w-7 sm:h-7" fill="currentColor" />
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPause}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-900/50 transition-all"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="white" />
          ) : (
            <Play size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white ml-0.5 sm:ml-1" fill="white" />
          )}
        </motion.button>

        <button
          onClick={onNext}
          className="p-2 sm:p-3 text-white hover:text-red-400 transition-all hover:scale-110"
          aria-label="Next video"
        >
          <SkipForward size={24} className="sm:w-7 sm:h-7" fill="currentColor" />
        </button>

        <button
          onClick={onToggleRepeat}
          className={`p-2 rounded-full transition-colors ${
            isRepeat ? 'text-red-400 bg-red-400/20' : 'text-gray-400 hover:text-white'
          }`}
          aria-label="Toggle repeat"
          title="Repeat"
        >
          <Repeat size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMute}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? <VolumeX size={18} className="sm:w-5 sm:h-5" /> : <Volume2 size={18} className="sm:w-5 sm:h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-red-400"
          aria-label="Volume"
          style={{
            background: `linear-gradient(to right, rgb(239 68 68) 0%, rgb(239 68 68) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
        <span className="text-xs text-gray-400 w-10 text-right">{isMuted ? 0 : volume}%</span>
      </div>
    </div>
  );
};

const VideoPlayer = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  isRepeat,
  isShuffle,
  onToggleRepeat,
  onToggleShuffle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden"
    >
      <div className="p-4 sm:p-6 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-b border-white/10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <Music2 className="text-red-400" size={20} />
          Now Playing
        </h2>
      </div>
      <NowPlaying currentTrack={currentTrack} />
      <div className="p-4 sm:p-6 border-t border-white/10">
        <PlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          onPlayPause={onPlayPause}
          onNext={onNext}
          onPrevious={onPrevious}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
          isRepeat={isRepeat}
          isShuffle={isShuffle}
          onToggleRepeat={onToggleRepeat}
          onToggleShuffle={onToggleShuffle}
        />
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
