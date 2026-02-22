import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CropByRegion {
  id: number;
  city: string;
  rank: number;
  date: string;
  crop_name: string;
  crop_variety: string;
  crop_profit: number;
  crop_sustain: number;
  crop_popularscore: number;
}

interface CropsByRegionState {
  crops: CropByRegion[];
}

const initialState: CropsByRegionState = {
  crops: [],
};

const cropsByRegionSlice = createSlice({
  name: 'cropsByRegion',
  initialState,
  reducers: {
    setCropsByRegion: (state, action: PayloadAction<CropByRegion[]>) => {
      state.crops = action.payload;
    },
  },
});

export const { setCropsByRegion } = cropsByRegionSlice.actions;
export default cropsByRegionSlice.reducer;
