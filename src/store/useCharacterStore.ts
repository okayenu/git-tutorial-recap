import { create } from 'zustand';

interface MorphTargetValues {
  [key: string]: number;
}

interface BoneScaleValues {
  [key: string]: number;
}

interface CharacterState {
  gender: 'female' | 'male';
  wireframe: boolean;
  morphs: MorphTargetValues;
  bones: BoneScaleValues;
  skinTone: string;
  roughness: number;
  hairColor: string;
  lipstickColor: string;
  lipstickOpacity: number;
  tattooOpacity: number;
  setGender: (gender: 'female' | 'male') => void;
  setWireframe: (wireframe: boolean) => void;
  setMorph: (name: string, value: number) => void;
  setBoneScale: (name: string, value: number) => void;
  setSkinTone: (color: string) => void;
  setRoughness: (value: number) => void;
  setHairColor: (color: string) => void;
  setLipstick: (color: string, opacity: number) => void;
  setTattooOpacity: (value: number) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  gender: 'female',
  wireframe: false,
  morphs: {},
  bones: {},
  skinTone: '#ffcbb3',
  roughness: 0.5,
  hairColor: '#2b1d16',
  lipstickColor: '#cc2244',
  lipstickOpacity: 0,
  tattooOpacity: 0,
  setGender: (gender) => set({ gender, morphs: {}, bones: {} }), // Reset morphs/bones on gender change
  setWireframe: (wireframe) => set({ wireframe }),
  setMorph: (name, value) =>
    set((state) => ({ morphs: { ...state.morphs, [name]: value } })),
  setBoneScale: (name, value) =>
    set((state) => ({ bones: { ...state.bones, [name]: value } })),
  setSkinTone: (color) => set({ skinTone: color }),
  setRoughness: (value) => set({ roughness: value }),
  setHairColor: (color) => set({ hairColor: color }),
  setLipstick: (color, opacity) => set({ lipstickColor: color, lipstickOpacity: opacity }),
  setTattooOpacity: (value) => set({ tattooOpacity: value }),
}));
