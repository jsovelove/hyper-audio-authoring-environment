import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    useStoreApi
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import './index.css';
import AudioDropzone from './AudioDropzone';
import useAudio from './useAudio';
import TextUpdaterNode from './TextUpdaterNode';
import BranchingPointNode from './BranchingPointNode';
import PlaylistNode from './PlaylistNode';
import AttributeNode from './AttributeNode';
import CustomAudioNode from './AudioNode';
import DatabaseView from './DatabaseView';
import { sortNodes, getId, getNodePositionInsideParent } from './utils';
import SelectedNodesToolbar from './SelectedNodesToolbar';
import '@reactflow/node-resizer/dist/style.css';


const proOptions = {
    hideAttribution: true,
};

const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

const initialNodes = [

];
const initialEdges = [

];

const nodeTypes = {
    textUpdater: TextUpdaterNode,
    branchingPoint: BranchingPointNode,
    playlist: PlaylistNode,
    attribute: AttributeNode,
    audio: CustomAudioNode,
};

function FlowComponent() {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((edge) => setEdges((eds) => addEdge(edge, eds)), [setEdges]);
    const { project, getIntersectingNodes } = useReactFlow();
    const store = useStoreApi();

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
        const currentNodesCount = nodes.length;

        const newNodes = await Promise.all(files.map(async (file, index) => {
            const audioSource = await loadAudio(file);
            const x = 50;
            const y = (currentNodesCount + index) * spacing;

            return {
                id: `audio${currentNodesCount + index}`,
                type: 'audio',
                position: { x, y },
                data: { label: file.name, audioSource },
            };
        }));

        const sortedNodes = store.getState().getNodes().concat(newNodes).sort(sortNodes);
        setNodes(sortedNodes);
    };

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const wrapperBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            let position = project({ x: event.clientX - wrapperBounds.x - 20, y: event.clientY - wrapperBounds.top - 20 });
            const nodeStyle = type === 'playlist' ? { width: 400, height: 200 } : undefined;


            const intersections = getIntersectingNodes({
                x: position.x,
                y: position.y,
                width: 40,
                height: 40,
            }).filter((n) => n.type === 'playlist');
            const playlistNode = intersections[0];


            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type}` },
                style: nodeStyle,
            };

            if (playlistNode) {
                newNode.position = getNodePositionInsideParent(
                    {
                        position,
                        width: 40,
                        height: 40,
                    },
                    playlistNode
                ) ?? { x: 0, y: 0 };
                newNode.parentNode = playlistNode?.id;
                newNode.extent = playlistNode ? 'parent' : undefined;
            }

            const sortedNodes = store.getState().getNodes().concat(newNode).sort(sortNodes);
            setNodes(sortedNodes);


        },
        [reactFlowInstance]
    );

    const onNodeDragStop = useCallback((event, node) => {
        if (!node.type == 'playlist' && !node.parentNode) {
            return;
        }

        const intersections = getIntersectingNodes(node).filter((n) => n.type === 'playlist');
        const playlistNode = intersections[0];

        if (intersections.length && node.parentNode !== playlistNode?.id) {
            const nextNodes = store
            ['getState']()
            ['getNodes']()
                .map((n) => {
                    if (n.id === playlistNode.id) {
                        return {
                            ...n,
                            className: '',
                        };
                    } else if (n.id === node.id) {
                        const position = getNodePositionInsideParent(n, playlistNode) ?? { x: 0, y: 0 };

                        return {
                            ...n,
                            position,
                            parentNode: playlistNode.id,
                            dragging: false,
                            extent: 'parent',
                        };
                    }

                    return n;
                })
                .sort(sortNodes);

            setNodes(nextNodes);
        }
    }, [getIntersectingNodes, setNodes, store]);


    const onNodeDrag = useCallback(
        (event, node) => {
            if (!node.type == 'playlist' && !node.parentNode) {
                return;
            }

            const intersections = getIntersectingNodes(node).filter((n) => n.type === 'playlist');
            const groupClassName = intersections.length && node.parentNode !== intersections[0]?.id ? 'active' : '';

            setNodes((nds) => {
                return nds.map((n) => {
                    if (n.type === 'playlist') {
                        return {
                            ...n,
                            className: groupClassName,
                        };
                    } else if (n.id === node.id) {
                        return {
                            ...n,
                            position: node.position,
                        };
                    }

                    return { ...n };
                });
            });
        },
        [getIntersectingNodes, setNodes]
    );

    const [showDatabaseView, setShowDatabaseView] = useState(false);

    const toggleDatabaseView = () => {
        setShowDatabaseView(!showDatabaseView);
    };

    return (
        <><div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <AudioDropzone onAudioFilesReceived={handleAudioFilesReceived} />
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                edges={edges}
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onInit={setReactFlowInstance}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onDrop={onDrop}
                onDragOver={onDragOver}
                proOptions={proOptions}
                selectNodesOnDrag={false}
                fitView
            >
                <Background color="#bbb" gap={50} variant="dots" />
                <SelectedNodesToolbar />
                <Controls />
                <button className="toggle-db-view-btn" onClick={toggleDatabaseView}>
                    {showDatabaseView ? 'Hide Database View' : 'Show Database View'}
                </button>
            </ReactFlow>
            {showDatabaseView && <DatabaseView nodes={nodes} edges={edges} />}
        </div><Sidebar /></>
    );
}

export default function Flow() {
    return (
        <ReactFlowProvider>
            <FlowComponent />
        </ReactFlowProvider>
    );
}
