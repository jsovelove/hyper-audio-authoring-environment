import { Handle, Position } from 'reactflow';

function BranchingPointNode({ data, isConnectable }) {
  return (
    <div className="branching-point-node">
      
      <div>
        Branching Point
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output_1" 
        style={{top: 10}}
        isConnectable={isConnectable} 
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{bottom: 10}}
        id="output_2"
        isConnectable={isConnectable} 
      />
    </div>
  );
}

export default BranchingPointNode;
