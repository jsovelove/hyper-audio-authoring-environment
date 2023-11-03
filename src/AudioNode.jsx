import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';


const CustomAudioNode = ({ data }) => {
  const { audioSource } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
      barWidth: 3
    });

    if (audioSource) {
      wavesurfer.current.load(audioSource);
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioSource]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    wavesurfer.current.playPause();
  };

  return (
    <div>
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div ref={waveformRef} />
    </div>
  );
};

export default CustomAudioNode;
