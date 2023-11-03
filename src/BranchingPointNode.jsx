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
      <svg xmlns="http://www.w3.org/2000/svg" height="100" viewBox="0 -960 960 960" width="100"><path d="M160-440v-80h304l200-200H560v-80h240v240h-80v-104L496-440H160Zm400 280v-80h104L536-366l58-58 126 128v-104h80v240H560Z"/></svg>
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{top: 70}}
        id="output_2"
        isConnectable={isConnectable} 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input_1"
        isConnectable={isConnectable} 
      />
    </div>
  );
}

export default BranchingPointNode;
