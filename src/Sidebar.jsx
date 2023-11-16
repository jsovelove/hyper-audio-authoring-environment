import React from 'react';
import { useStore } from 'reactflow';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">Intents</div>
      <div className="dndnode branchingPoint" onDragStart={(event) => onDragStart(event, 'branchingPoint')} draggable>
        Branching Point
      </div>
      <div className="dndnode grouper" onDragStart={(event) => onDragStart(event, 'playlist')} draggable>
        Playlist Builder
      </div>
      <div className="dndnode attribute" onDragStart={(event) => onDragStart(event, 'attribute')} draggable>
        Attribute Node
      </div>
      
      <div className="description">Utterance</div>
      <div className="dndnode utterance" onDragStart={(event) => onDragStart(event, 'textUpdater')} draggable>
        Utterance Node
      </div>
      
      
    </aside>
  );
};
