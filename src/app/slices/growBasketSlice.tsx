import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

interface CropInfo {
  rank?: number;
  name: string;
  variety: string;
  crop_type: string;
  growthCycle: string;
  yieldPotential: string;
}

interface GrowBasketState {
  farmId: string | null ;
  basket: CropInfo[];
}

const initialState: GrowBasketState = {
  farmId: null,
  basket: [],
};

const growBasketSlice = createSlice({
  name: "growBasket",
  initialState,
  reducers: {
    setFarmId: (state, action: PayloadAction<string| null>) => {
      state.farmId = action.payload;
    },
    addCrop: (state, action: PayloadAction<CropInfo>) => {
      if (!Array.isArray(state.basket)) {
        state.basket = [];
      }
      const exists = state.basket.some(
        (crop) =>
          crop.name.toLowerCase() === action.payload.name.toLowerCase() &&
          crop.variety.toLowerCase() === action.payload.variety.toLowerCase() &&
          crop.crop_type.toLowerCase() === action.payload.crop_type.toLowerCase()
      );
      if (!exists) {
        state.basket.push(action.payload);
      }
    },
    removeCrop: (state, action: PayloadAction<number>) => {
      state.basket.splice(action.payload, 1);
    },
    clearBasket: (state) => {
      state.basket = [];
      state.farmId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.farmId = null;
      state.basket = [];
    });
  },
});

export const { setFarmId, addCrop, removeCrop, clearBasket } = growBasketSlice.actions;
export default growBasketSlice.reducer;
