import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import './index.css';
import AudioDropzone from './AudioDropzone';
import useAudio from './useAudio';
import TextUpdaterNode from './TextUpdaterNode';
import BranchingPointNode from './BranchingPointNode';
import GrouperNode from './GrouperNode';
import AttributeNode from './AttributeNode';
import CustomAudioNode from './AudioNode';

const initialNodes = [
  
];


let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = { 
  textUpdater: TextUpdaterNode,
  branchingPoint: BranchingPointNode,
  grouper: GrouperNode,
  attribute: AttributeNode,
  audio: CustomAudioNode,
 };


export default function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  const loadAudio = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };
  
  const handleAudioFilesReceived = async (files) => {
    const spacing = 50;
    const newNodes = await Promise.all(files.map(async (file, index) => {
        const audioSource = await loadAudio(file);
        const x = 50;
        const y = index * spacing;
    
        return {
            id: `audio${index}`,
            type: 'audio',
            position: { x, y },
            data: { label: file.name, audioSource },
        };
    }));
    
    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
};

  
  




  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
  
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
  
      if (!type) {
        return;
      }
  
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
  
      let newNode;
  
      switch (type) {
        case 'grouper':
        newNode = {
          id: getId(),
          type,
          position,
          data: { label: 'Group Name' },
        };
        break;
        
        case 'attribute':
        newNode = {
          id: getId(),
          type,
          position,
          data: { label: '' },
        };
        break;

        case 'textUpdater':
          newNode = {
            id: getId(),
            type,
            position,
            data: { label: 'Type your text here' },
          };
          break;
        
        case 'branchingPoint':
          newNode = {
            id: getId(),
            type,
            position,
            data: { label: 'Branching Point' },
          };
          break;
        
        case 'input':
        case 'default':
        case 'output':
          newNode = {
            id: getId(),
            type,
            position,
            data: { label: `${type} node` },
          };
          break;
  
        default:
          console.error('Unknown node type:', type);
          return;
      }
  
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );
  
    

  return (

    <div className="dndflow" style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <AudioDropzone onAudioFilesReceived={handleAudioFilesReceived} />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};
