import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Handle, Position } from 'reactflow';



const CustomAudioNode = ({ data, isConnectable}) => {
  const { audioSource } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
      barWidth: 1
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
    <div className="audio-node-container">
        <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectable={isConnectable}
      />
        <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-source"
        isConnectable={isConnectable}
      />
      <button className="audio-control-button" onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div className="waveform-container" ref={waveformRef} />
    </div>
  );
  
};

export default CustomAudioNode;
