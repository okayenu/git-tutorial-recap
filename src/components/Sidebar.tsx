import React, { useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { Settings2, User, Activity } from 'lucide-react';

const facialMorphs = [
  { name: 'NoseWidth', label: 'Nose Width' },
  { name: 'NoseBridgeHeight', label: 'Nose Bridge Height' },
  { name: 'LipFullness', label: 'Lip Fullness' },
  { name: 'EyeSquint', label: 'Eye Squint' },
  { name: 'JawWidth', label: 'Jaw Width' },
];

const bodyBones = [
  { name: 'Spine', label: 'Global Scale' },
  { name: 'LeftArm', label: 'Left Arm Length' },
  { name: 'RightArm', label: 'Right Arm Length' },
  { name: 'Neck', label: 'Neck Length' },
];

const Sidebar: React.FC = () => {
  const { gender, setGender, wireframe, setWireframe, morphs, setMorph, bones, setBoneScale } = useCharacterStore();
  const [tab, setTab] = useState<'face' | 'body' | 'settings'>('face');

  return (
    <div className="w-80 h-full bg-gray-800 text-gray-200 shadow-xl flex flex-col z-10 border-l border-gray-700">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
        <h1 className="text-xl font-bold text-white tracking-wide">Customization</h1>
      </div>

      <div className="flex border-b border-gray-700 bg-gray-900">
        <button
          className={`flex-1 p-3 flex justify-center items-center transition-colors ${tab === 'face' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'hover:bg-gray-800/50'}`}
          onClick={() => setTab('face')}
        >
          <User size={18} className="mr-2" /> Face
        </button>
        <button
          className={`flex-1 p-3 flex justify-center items-center transition-colors ${tab === 'body' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'hover:bg-gray-800/50'}`}
          onClick={() => setTab('body')}
        >
          <Activity size={18} className="mr-2" /> Body
        </button>
        <button
          className={`flex-1 p-3 flex justify-center items-center transition-colors ${tab === 'settings' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'hover:bg-gray-800/50'}`}
          onClick={() => setTab('settings')}
        >
          <Settings2 size={18} className="mr-2" /> Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {tab === 'face' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Facial Features</h2>
            {facialMorphs.map((morph) => (
              <div key={morph.name}>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">{morph.label}</label>
                  <span className="text-xs text-gray-400">{(morphs[morph.name] || 0).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={morphs[morph.name] || 0}
                  onChange={(e) => setMorph(morph.name, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'body' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Body Proportions</h2>
            {bodyBones.map((bone) => (
              <div key={bone.name}>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">{bone.label}</label>
                  <span className="text-xs text-gray-400">{(bones[bone.name] || 1).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.01"
                  value={bones[bone.name] || 1}
                  onChange={(e) => setBoneScale(bone.name, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Base Model</h2>
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 text-sm rounded-md transition-all ${gender === 'female' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setGender('female')}
                >
                  Female
                </button>
                <button
                  className={`flex-1 py-2 text-sm rounded-md transition-all ${gender === 'male' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setGender('male')}
                >
                  Male
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Rendering</h2>
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  checked={wireframe}
                  onChange={(e) => setWireframe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-gray-700 border-gray-600"
                />
                <span className="text-sm">Wireframe Debug Mode</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
