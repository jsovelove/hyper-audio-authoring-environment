import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const GrouperNode = ({ data }) => {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
      }, []);
  return (
      <div className="grouper-node">
          <div className="group-name">
              <label htmlFor="text">Group Name:</label>
              <input id="text" name="text" onChange={onChange} className="nodrag" onMouseDown={(e) => e.stopPropagation()} />
          </div>
      </div>
  );
}

export default GrouperNode;
