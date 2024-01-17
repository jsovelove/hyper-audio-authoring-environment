import React from 'react';
import './DatabaseView.css';

const DatabaseView = ({ nodes }) => {
  return (
    <div className="database-view-container">
      {nodes.map((node) => {
        if (node.type === 'audio') {
          const playlistName = node.data.playlist;
          const order = node.data.order;
          const nodeName = node.data.name; // Get the name from the node's data

          return (
            <div key={node.id} className="audio-node-entry">
              <div>Node Name: {nodeName || 'Unnamed Node'}</div> {/* Display the node name */}
              {playlistName && <div>Playlist Name: {playlistName}</div>}
              {order && <div>Order: {order}</div>}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default DatabaseView;
