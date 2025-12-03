import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const WaveVisualizer = ({ isPlaying }) => {
  const waveRefs = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      // Start animation when playing
      animationRef.current = gsap.to(waveRefs.current, {
        scaleY: 1.5,
        duration: 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: {
          each: 0.1,
          from: 'center',
        },
      });
    } else {
      // Stop animation when paused
      if (animationRef.current) {
        animationRef.current.kill();
      }
      gsap.to(waveRefs.current, {
        scaleY: 1,
        duration: 0.2,
        ease: 'power1.out',
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isPlaying]);

  const setWaveRef = (el, index) => {
    waveRefs.current[index] = el;
  };

  return (
    <div className="wave-container">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          ref={(el) => setWaveRef(el, index)}
          className="wave"
        />
      ))}
    </div>
  );
};

export default WaveVisualizer;
