import React from 'react';
import FlowComponent from './FlowComponent';
import { AttributesProvider } from './AttributesContext';

export default function App() {
  return (
    <AttributesProvider>
      <div className="dndflow" style={{ width: '100vw', height: '100vh' }}>
        <FlowComponent />
      </div>
    </AttributesProvider>

  );
}
