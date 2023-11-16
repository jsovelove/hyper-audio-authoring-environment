import React from 'react';
import './DatabaseView.css';

const DatabaseView = ({ nodes }) => {
  return (
    <div className="database-view-container">
      {nodes.map((node) => {
        if (node.type === 'audio') {
          const hasParent = node.parentNode !== undefined;
          return (
            <div key={node.id} className="audio-node-entry">
              <div>{node.data.label}</div>
              {hasParent && <div>Parent Node ID: {node.parentNode}</div>}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default DatabaseView;
