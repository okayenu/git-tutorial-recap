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
  const { 
    gender, setGender, 
    wireframe, setWireframe, 
    photobooth, setPhotobooth,
    morphs, setMorph, 
    bones, setBoneScale,
    skinTone, setSkinTone,
    roughness, setRoughness,
    hairColor, setHairColor,
    lipstickColor, lipstickOpacity, setLipstick,
    tattooOpacity, setTattooOpacity,
    undo, redo, exportPreset, importPreset,
    history, historyIndex, commitHistory
  } = useCharacterStore();
  const [tab, setTab] = useState<'face' | 'body' | 'skin' | 'settings'>('face');

  const handleImport = () => {
    const json = prompt("Paste your Character Preset JSON here:");
    if (json) {
      importPreset(json);
    }
  };

  const handleExport = () => {
    const json = exportPreset();
    navigator.clipboard.writeText(json);
    alert("Preset JSON copied to clipboard!");
  };

  return (
    <div className="w-80 h-full bg-black/40 backdrop-blur-xl text-gray-200 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col z-10 border-l border-white/10">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h1 className="text-xl font-bold text-white tracking-wide drop-shadow-md">Customization</h1>
        <div className="flex space-x-2">
          <button 
            onClick={undo} 
            disabled={historyIndex <= 0}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded text-xs transition-colors"
            title="Undo"
          >
            ↩ Undo
          </button>
          <button 
            onClick={redo} 
            disabled={historyIndex >= history.length - 1}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded text-xs transition-colors"
            title="Redo"
          >
            ↪ Redo
          </button>
        </div>
      </div>

      <div className="flex border-b border-white/10 bg-black/20 text-xs">
        <button
          className={`flex-1 p-2 flex justify-center items-center transition-all duration-300 ${tab === 'face' ? 'bg-white/10 text-white shadow-[inset_0_-2px_0_0_#3b82f6]' : 'hover:bg-white/5'}`}
          onClick={() => setTab('face')}
        >
          Face
        </button>
        <button
          className={`flex-1 p-2 flex justify-center items-center transition-all duration-300 ${tab === 'body' ? 'bg-white/10 text-white shadow-[inset_0_-2px_0_0_#3b82f6]' : 'hover:bg-white/5'}`}
          onClick={() => setTab('body')}
        >
          Body
        </button>
        <button
          className={`flex-1 p-2 flex justify-center items-center transition-all duration-300 ${tab === 'skin' ? 'bg-white/10 text-white shadow-[inset_0_-2px_0_0_#3b82f6]' : 'hover:bg-white/5'}`}
          onClick={() => setTab('skin')}
        >
          Skin/Hair
        </button>
        <button
          className={`flex-1 p-2 flex justify-center items-center transition-all duration-300 ${tab === 'settings' ? 'bg-white/10 text-white shadow-[inset_0_-2px_0_0_#3b82f6]' : 'hover:bg-white/5'}`}
          onClick={() => setTab('settings')}
        >
          Settings
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
                  onMouseUp={commitHistory}
                  onTouchEnd={commitHistory}
                  title={`Adjust ${morph.label} (0.0 to 1.0)`}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-blue-400 backdrop-blur-sm border border-white/10 shadow-inner"
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
                  onMouseUp={commitHistory}
                  onTouchEnd={commitHistory}
                  title={`Scale ${bone.label} (0.5x to 1.5x)`}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-green-400 backdrop-blur-sm border border-white/10 shadow-inner"
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'skin' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Skin & Details</h2>
              
              <div className="space-y-1">
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Skin Tone</label>
                </div>
                <input
                  type="color"
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  className="w-full h-8 bg-black/40 rounded border border-white/10 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Skin Roughness/Oiliness</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  onMouseUp={commitHistory}
                  onTouchEnd={commitHistory}
                  title="Adjust Skin Roughness/Oiliness"
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-orange-400 backdrop-blur-sm border border-white/10 shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Tattoo/Decal Opacity</label>
                  <span className="text-xs text-gray-400">{tattooOpacity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tattooOpacity}
                  onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
                  onMouseUp={commitHistory}
                  onTouchEnd={commitHistory}
                  title="Adjust Decal Opacity"
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-400 backdrop-blur-sm border border-white/10 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Hair & Makeup</h2>
              
              <div className="space-y-1">
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Hair Color</label>
                </div>
                <input
                  type="color"
                  value={hairColor}
                  onChange={(e) => setHairColor(e.target.value)}
                  className="w-full h-8 bg-black/40 rounded border border-white/10 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Lipstick Color</label>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={lipstickColor}
                    onChange={(e) => setLipstick(e.target.value, lipstickOpacity)}
                    className="flex-1 h-8 bg-black/40 rounded border border-white/10 cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={lipstickOpacity}
                    onChange={(e) => setLipstick(lipstickColor, parseFloat(e.target.value))}
                    onMouseUp={commitHistory}
                    onTouchEnd={commitHistory}
                    className="flex-1 h-8 bg-black/40 rounded-lg appearance-none cursor-pointer accent-pink-500 backdrop-blur-sm border border-white/10 shadow-inner"
                    title="Lipstick Opacity"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Base Model</h2>
              <div className="flex bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10 shadow-inner">
                <button
                  className={`flex-1 py-2 text-sm rounded-md transition-all duration-300 ${gender === 'female' ? 'bg-white/20 text-white shadow-lg backdrop-blur-lg border border-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  onClick={() => setGender('female')}
                >
                  Female
                </button>
                <button
                  className={`flex-1 py-2 text-sm rounded-md transition-all duration-300 ${gender === 'male' ? 'bg-white/20 text-white shadow-lg backdrop-blur-lg border border-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  onClick={() => setGender('male')}
                >
                  Male
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Rendering & Env</h2>
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-black/30 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-sm" title="Show mesh wireframes">
                <input
                  type="checkbox"
                  checked={wireframe}
                  onChange={(e) => setWireframe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-black/50 border-white/20"
                />
                <span className="text-sm text-gray-200">Wireframe Debug Mode</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-black/30 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-sm" title="Enable studio lighting and dark background">
                <input
                  type="checkbox"
                  checked={photobooth}
                  onChange={(e) => setPhotobooth(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-black/50 border-white/20"
                />
                <span className="text-sm text-gray-200">Photobooth Mode</span>
              </label>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Preset Management</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handleExport}
                  title="Export Current Configuration to JSON"
                  className="flex-1 p-2 bg-indigo-600/50 hover:bg-indigo-600 border border-indigo-400/30 rounded text-sm transition-all shadow-md"
                >
                  Export JSON
                </button>
                <button 
                  onClick={handleImport}
                  title="Import Configuration from JSON"
                  className="flex-1 p-2 bg-emerald-600/50 hover:bg-emerald-600 border border-emerald-400/30 rounded text-sm transition-all shadow-md"
                >
                  Import JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
