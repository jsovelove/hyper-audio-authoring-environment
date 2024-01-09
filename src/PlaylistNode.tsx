import { memo, useState } from 'react';
import { getRectOfNodes, NodeProps, NodeToolbar, useReactFlow, useStore, useStoreApi, NodeResizer, useNodes } from 'reactflow';
import './index.css';
import useDetachNodes from './useDetachNodes';
import React from 'react';

const lineStyle = { borderColor: 'white' };
const padding = 25;

function PlaylistNode({ id, data}: NodeProps) {
  const store = useStoreApi();

  const [playlistName, setPlaylistName] = useState('');
  

  const { deleteElements, setNodes } = useReactFlow();
  const detachNodes = useDetachNodes();
  const { minWidth, minHeight, hasChildNodes } = useStore((store) => {
    const childNodes = Array.from(store.nodeInternals.values()).filter((n) => n.parentNode === id);
    const rect = getRectOfNodes(childNodes);

    return {
      minWidth: rect.width + padding * 2,
      minHeight: rect.height + padding * 2,
      hasChildNodes: childNodes.length > 0,
    };
  }, isEqual);

  const onDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const onDetach = () => {
    const childNodeIds = Array.from(store.getState().nodeInternals.values())
      .filter((n) => n.parentNode === id)
      .map((n) => n.id);

    detachNodes(childNodeIds, id);
  };

  const updatePlaylistName = () => {
    const childNodeIds = Array.from(store.getState().nodeInternals.values())
      .filter((n) => n.parentNode === id)
      .map((n) => n.id);
  
    const updatedNodes = store
      .getState()
      .getNodes()
      .map((node) => {
        if (childNodeIds.includes(node.id)) {
          return {
            ...node,
            data: {
              ...node.data,
              playlist: playlistName,
            },
          };
        }
        return node;
      });
  
    const playlistNode = updatedNodes.find((node) => node.id === id);
    if (playlistNode) {
      playlistNode.data = {
        ...playlistNode.data,
        playlist: playlistName,
      };
    }
  
    setNodes(updatedNodes);
  };
  


  return (
    <div style={{ minWidth, minHeight }}>
        <div className="playlist-name">{data.playlist && <div className="playlist-name">{data.playlist}</div>}</div>

      <NodeResizer lineStyle={lineStyle} minWidth={minWidth} minHeight={minHeight} />
      <NodeToolbar className="nodrag">
        <button onClick={onDelete}>Delete</button>
        
        <input
        type="text"
        placeholder="Enter playlist name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <button onClick={updatePlaylistName}>Set Playlist Name</button>
      
        {hasChildNodes && <button onClick={onDetach}>Ungroup</button>}
      </NodeToolbar>
    </div>
  );
}

type IsEqualCompareObj = {
  minWidth: number;
  minHeight: number;
  hasChildNodes: boolean;
};

function isEqual(prev: IsEqualCompareObj, next: IsEqualCompareObj): boolean {
  return (
    prev.minWidth === next.minWidth && prev.minHeight === next.minHeight && prev.hasChildNodes === next.hasChildNodes
  );
}

export default memo(PlaylistNode);
