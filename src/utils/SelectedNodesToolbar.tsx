import { useNodes, Node, getRectOfNodes, NodeToolbar, useStoreApi, useReactFlow } from 'reactflow';

import { getId } from './utils';
import React from 'react';

const padding = 25;

export default function SelectedNodesToolbar() {
  const nodes = useNodes();
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const selectedNodes = nodes.filter((node) => node.selected && !node.parentNode);
  const selectedNodeIds = selectedNodes.map((node) => node.id);
  const isVisible = selectedNodeIds.length > 1;

  const onGroup = () => {
    const rectOfNodes = getRectOfNodes(selectedNodes);
    const groupId = getId('playlist');
    const parentPosition = {
      x: rectOfNodes.x,
      y: rectOfNodes.y,
    };
    const groupNode = {
      id: groupId,
      type: 'playlist',
      position: parentPosition,
      style: { width: rectOfNodes.width + padding * 2, height: rectOfNodes.height + padding * 2 },
      data: {},
    };

    const nextNodes: Node[] = nodes.map((node) => {
      if (selectedNodeIds.includes(node.id)) {
        return {
          ...node,
          position: {
            x: node.position.x - parentPosition.x + padding,
            y: node.position.y - parentPosition.y + padding,
          },
          extent: 'parent',
          parentNode: groupId,
        };
      }

      return node;
    });

    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
    setNodes([groupNode, ...nextNodes]);
  };

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={isVisible}>
      <button onClick={onGroup}>Group selected nodes</button>
    </NodeToolbar>
  );
}
