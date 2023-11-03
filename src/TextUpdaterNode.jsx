import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';


function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <div>
        <label htmlFor="text">Utterance:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" onMouseDown={(e) => e.stopPropagation()} />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="utterance-source-bottom"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="utterance-source-right"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="utterance-target-left"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
