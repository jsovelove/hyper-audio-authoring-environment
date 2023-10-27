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




const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];


let id = 0;
const getId = () => `dndnode_${id++}`;


export default function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);


  const { loadAudio, playAudio } = useAudio();

  const handleAudioFilesReceived = async (files) => {
    const newNodes = await Promise.all(files.map(async (file, index) => {
      const audioSource = await loadAudio(file);

      return {
        id: `audio${index}`,
        position: { x: index * 100, y: 50 },
        data: { label: file.name, audioSource },
      };
    }));

    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
  };

  const handleNodeClick = (event, element) => {
    if (element && element.data && element.data.audioSource) {
      playAudio(element.data.audioSource);
    }
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

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

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
            onNodeClick={handleNodeClick}
            nodes={nodes}
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
