import React from 'react';
import './DatabaseView.css';

const DatabaseView = ({ nodes }) => {
  return (
    <div className="database-view-container">
      {nodes.map((node, index) => {
        if (node.type === 'audio') {
          return (
            <div key={node.id} className="audio-node-entry">
              <div>Node {index + 1}: {node.data.label}</div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default DatabaseView;
