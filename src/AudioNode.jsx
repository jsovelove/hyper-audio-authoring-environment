import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Handle, Position } from 'reactflow';
import { useAttributes } from './AttributesContext';

const CustomAudioNode = ({ data, isConnectable }) => {
  const { audioSource } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const { globalAttributes, nodeLinks } = useAttributes();

  // Find the attribute node ID linked to this audio node
  const linkedAttributeNodeId = Object.keys(nodeLinks).find(key => nodeLinks[key].includes(data.id));
  
  // Fetch the attributes from the linked node
  const linkedAttributes = linkedAttributeNodeId ? globalAttributes[linkedAttributeNodeId] : [];

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
        {linkedAttributes && linkedAttributes.map(attr => (
          <div key={attr.name}>
              <span>{attr.name}: </span>
              <span>{attr.value}</span>
          </div>
        ))}
    </div>
  );
};

export default CustomAudioNode;
