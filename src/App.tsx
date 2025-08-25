import React from 'react';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="w-full h-full flex">
      <div className="flex-1 relative">
        <Scene />
      </div>
      <Sidebar />
    </div>
  );
}

export default App;
