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
  setGender: (gender: 'female' | 'male') => void;
  setWireframe: (wireframe: boolean) => void;
  setMorph: (name: string, value: number) => void;
  setBoneScale: (name: string, value: number) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  gender: 'female',
  wireframe: false,
  morphs: {},
  bones: {},
  setGender: (gender) => set({ gender, morphs: {}, bones: {} }), // Reset morphs/bones on gender change
  setWireframe: (wireframe) => set({ wireframe }),
  setMorph: (name, value) =>
    set((state) => ({ morphs: { ...state.morphs, [name]: value } })),
  setBoneScale: (name, value) =>
    set((state) => ({ bones: { ...state.bones, [name]: value } })),
}));
