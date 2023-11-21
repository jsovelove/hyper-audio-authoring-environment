import React from 'react';
import './DatabaseView.css';

const DatabaseView = ({ nodes }) => {
  return (
    <div className="database-view-container">
      {nodes.map((node) => {
        if (node.type === 'audio') {
          const playlistName = node.data.playlist;
          const order = node.data.order;

          return (
            <div key={node.id} className="audio-node-entry">
              <div>{node.data.label}</div>
              {playlistName && <div>Playlist Name: {playlistName}</div>}
              {order && <div>Order: {order}</div>} {/* Display the 'order' field */}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default DatabaseView;
