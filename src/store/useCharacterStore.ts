import { create } from 'zustand';

interface MorphTargetValues {
  [key: string]: number;
}

interface BoneScaleValues {
  [key: string]: number;
}

export interface CharacterStateData {
  gender: 'female' | 'male';
  morphs: MorphTargetValues;
  bones: BoneScaleValues;
  skinTone: string;
  roughness: number;
  hairColor: string;
  lipstickColor: string;
  lipstickOpacity: number;
  tattooOpacity: number;
}

interface CharacterState extends CharacterStateData {
  wireframe: boolean;
  photobooth: boolean;
  
  // History
  history: CharacterStateData[];
  historyIndex: number;

  // Actions
  setGender: (gender: 'female' | 'male') => void;
  setWireframe: (wireframe: boolean) => void;
  setPhotobooth: (photobooth: boolean) => void;
  
  setMorph: (name: string, value: number) => void;
  setBoneScale: (name: string, value: number) => void;
  setSkinTone: (color: string) => void;
  setRoughness: (value: number) => void;
  setHairColor: (color: string) => void;
  setLipstick: (color: string, opacity: number) => void;
  setTattooOpacity: (value: number) => void;

  undo: () => void;
  redo: () => void;
  commitHistory: () => void;
  exportPreset: () => string;
  importPreset: (json: string) => void;
}

const getBaseState = (): CharacterStateData => ({
  gender: 'female',
  morphs: {},
  bones: {},
  skinTone: '#ffcbb3',
  roughness: 0.5,
  hairColor: '#2b1d16',
  lipstickColor: '#cc2244',
  lipstickOpacity: 0,
  tattooOpacity: 0,
});

export const useCharacterStore = create<CharacterState>((set, get) => ({
  ...getBaseState(),
  wireframe: false,
  photobooth: false,
  history: [getBaseState()],
  historyIndex: 0,

  commitHistory: () => {
    const state = get();
    const currentStateData: CharacterStateData = {
      gender: state.gender,
      morphs: { ...state.morphs },
      bones: { ...state.bones },
      skinTone: state.skinTone,
      roughness: state.roughness,
      hairColor: state.hairColor,
      lipstickColor: state.lipstickColor,
      lipstickOpacity: state.lipstickOpacity,
      tattooOpacity: state.tattooOpacity,
    };
    
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(currentStateData);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const prevIndex = state.historyIndex - 1;
      set({ ...state.history[prevIndex], historyIndex: prevIndex });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const nextIndex = state.historyIndex + 1;
      set({ ...state.history[nextIndex], historyIndex: nextIndex });
    }
  },

  exportPreset: () => {
    const state = get();
    const data: CharacterStateData = {
      gender: state.gender,
      morphs: state.morphs,
      bones: state.bones,
      skinTone: state.skinTone,
      roughness: state.roughness,
      hairColor: state.hairColor,
      lipstickColor: state.lipstickColor,
      lipstickOpacity: state.lipstickOpacity,
      tattooOpacity: state.tattooOpacity,
    };
    return JSON.stringify(data, null, 2);
  },

  importPreset: (json) => {
    try {
      const data: CharacterStateData = JSON.parse(json);
      set({ ...data });
      get().commitHistory();
    } catch (e) {
      console.error("Invalid preset JSON");
    }
  },

  setGender: (gender) => {
    set({ gender, morphs: {}, bones: {} });
    get().commitHistory();
  },
  setWireframe: (wireframe) => set({ wireframe }),
  setPhotobooth: (photobooth) => set({ photobooth }),
  setMorph: (name, value) => {
    set((state) => ({ morphs: { ...state.morphs, [name]: value } }));
  },
  setBoneScale: (name, value) => {
    set((state) => ({ bones: { ...state.bones, [name]: value } }));
  },
  setSkinTone: (color) => { 
    set({ skinTone: color }); 
    get().commitHistory(); 
  },
  setRoughness: (value) => { 
    set({ roughness: value }); 
  },
  setHairColor: (color) => { 
    set({ hairColor: color }); 
    get().commitHistory(); 
  },
  setLipstick: (color, opacity) => { 
    set({ lipstickColor: color, lipstickOpacity: opacity }); 
  },
  setTattooOpacity: (value) => { 
    set({ tattooOpacity: value }); 
  },
}));