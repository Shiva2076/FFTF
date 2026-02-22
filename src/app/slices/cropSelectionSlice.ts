import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedCrop {
  id: number;
  name: string;
  variety: string;
  crop_type: string;
}

interface CropSelectionState {
  selectedCrops: SelectedCrop[];
}

const initialState: CropSelectionState = {
  selectedCrops: [],
};

const cropSelectionSlice = createSlice({
  name: "cropSelection",
  initialState,
  reducers: {
    toggleCropSelection: (state, action: PayloadAction<SelectedCrop>) => {
      const exists = state.selectedCrops.some(
        (c) => c.id === action.payload.id
      );
      if (exists) {
        state.selectedCrops = state.selectedCrops.filter((c) => c.id !== action.payload.id);
      } else {
        state.selectedCrops.push(action.payload);
      }
    },
    removeCropSelectionByNameVariety: (
      state,
      action: PayloadAction<{ name: string; variety: string ; crop_type: string }>
    ) => {
      state.selectedCrops = state.selectedCrops.filter(
        (crop) =>
          crop.name.toLowerCase() !== action.payload.name.toLowerCase() ||
          crop.variety.toLowerCase() !== action.payload.variety.toLowerCase() ||
          crop.crop_type.toLowerCase() !== action.payload.crop_type.toLowerCase()
      );
    },
    clearSelections: (state) => {
      state.selectedCrops = [];
    },
  },
});

export const { toggleCropSelection, clearSelections, removeCropSelectionByNameVariety } = cropSelectionSlice.actions;
export default cropSelectionSlice.reducer;