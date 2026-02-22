import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CropGrowingGuideState {
  data: any; // Replace `any` with a more specific type if desired
}

const initialState: CropGrowingGuideState = {
  data: null,
};

const cropGrowingGuideSlice = createSlice({
  name: 'cropGrowingGuide',
  initialState,
  reducers: {
    setCropGrowingGuide(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
  },
});

export const { setCropGrowingGuide } = cropGrowingGuideSlice.actions;
export default cropGrowingGuideSlice.reducer;
