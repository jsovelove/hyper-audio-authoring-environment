import React, { useState, useRef, useEffect, memo } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Handle, Position, NodeToolbar, useStore, useReactFlow } from 'reactflow';
import useDetachNodes from './useDetachNodes';

const CustomAudioNode = ({ data, isConnectable, id }) => {
  const { setNodes } = useReactFlow();
  const [nodeName, setNodeName] = useState(data.name || '');
  const [isEditingName, setIsEditingName] = useState(false);

  const toggleNameEdit = () => {
    setIsEditingName(!isEditingName);
  };

  const handleNodeNameChange = (e) => setNodeName(e.target.value);

  const handleNodeNameSubmit = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, name: nodeName } };
        }
        return node;
      })
    );
  };

  const hasParent = useStore((store) => !!store.nodeInternals.get(id)?.parentNode);
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();

  const onDelete = () => deleteElements({ nodes: [{ id }] });
  const onDetach = () => detachNodes([id]);

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
     {data.name && <div className="node-name-display">{data.name}</div>}
      {isEditingName && (
        <div className="node-name-edit">
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Node Name"
          />
          <button onClick={() => { handleNodeNameSubmit(); toggleNameEdit(); }}>Set Name</button>
        </div>
      )}
      <button onClick={toggleNameEdit}>
        {isEditingName ? 'Cancel' : 'Edit Name'}
      </button>
      <NodeToolbar className="nodrag">
        <button onClick={onDelete}>Delete</button>
        {hasParent && <button onClick={onDetach}>Detach</button>}
      </NodeToolbar>
      <Handle
        type="source"
        position={Position.Bottom}
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
      <div className="audio-controls">
        <button className="audio-control-button" onClick={handlePlayPause}>
          {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" /></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" /></svg>}
        </button>
        <div className="waveform-container" ref={waveformRef} />
      </div>
      {audioAttributes && audioAttributes.map(attr => (
        <div key={attr.name}>
          <span>{attr.name}:</span>
          <span>{attr.value}</span>
        </div>
      ))}
    </div>
  );
};

export default memo(CustomAudioNode);
