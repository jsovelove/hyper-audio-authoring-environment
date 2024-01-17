import ReactFlow, { ReactFlowProvider } from 'reactflow';
import FlowComponent from './components/FlowComponent.jsx';

function App() {
  return (
    <div className="dndflow" style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <FlowComponent />
      </ReactFlowProvider>
    </div>

  );
}

export default App;