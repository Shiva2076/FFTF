import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string = 'Leafy-Greens';

export const selectedCropTypeSlice = createSlice({
  name: 'selectedCropTypetab',
  initialState,
  reducers: {
    setSelectedCropType: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { setSelectedCropType } = selectedCropTypeSlice.actions;
export default selectedCropTypeSlice.reducer;