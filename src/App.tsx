import React from 'react';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* 3D Scene Background */}
      <div className="absolute inset-0">
        <Scene />
      </div>
      
      {/* Overlay UI */}
      <div className="absolute top-0 right-0 h-full pointer-events-none">
        <div className="pointer-events-auto h-full">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
