import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Handle, Position } from 'reactflow';

const CustomAudioNode = ({ data, isConnectable }) => {
  const { audioSource, audioAttributes } = data;
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
        {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>: 
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>}
      </button>
      <div className="waveform-container" ref={waveformRef} />
      {audioAttributes && audioAttributes.map(attr => (
        <div key={attr.name}>
          <span>{attr.name}: </span>
          <span>{attr.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomAudioNode;
