import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [musicSource, setMusicSource] = useState('jamendo'); // 'jamendo' or 'spotify'

  // Update audio src when track changes
  useEffect(() => {
    if (currentTrack?.audio) {
      audioRef.current.src = currentTrack.audio;
      audioRef.current.volume = volume;
      
      // Update music source
      setMusicSource(currentTrack.source || 'jamendo');
      
      // Auto-play when track loads
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Playback error:', error);
            setIsPlaying(false);
            
            // If Spotify preview not available, show message
            if (currentTrack.source === 'spotify' && !currentTrack.audio) {
              console.warn('Spotify preview not available for this track');
            }
          });
      }
    }
  }, [currentTrack]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      // Auto-play next track
      playNext();
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentIndex, queue]);

  // Update volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track, trackQueue = []) => {
    setCurrentTrack(track);
    
    // If queue is provided, set it up
    if (trackQueue.length > 0) {
      setQueue(trackQueue);
      const index = trackQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      // Single track play
      setQueue([track]);
      setCurrentIndex(0);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Play error:', error);
          });
      }
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    
    // If more than 3 seconds played, restart current track
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };

  const addToQueue = (track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
  };

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    currentIndex,
    musicSource,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    changeVolume,
    addToQueue,
    removeFromQueue,
    clearQueue,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
