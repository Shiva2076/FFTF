import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MarketLiveSnapshotItem {
  cropName: string;
  variety: string;
  pricePerKg?: number | string; // For Leafy Greens: can be a number or a range string like "39.94-49.5"
  pricePerPunnet?: number | string; // For Microgreens: can be a number or string like "15" or "8.625"
  priceChangePercentage: number | string; // Can be a number or string
  demand: "High Demand" | "Medium Demand" | "Low Demand" | "High" | "Medium" | "Low"; // Support both formats
}

export interface MarketLiveSnapshotState {
  cropType: string;
  data: MarketLiveSnapshotItem[];
  description: string;
  duration: string;
  section: string;
  title: string;
}

const initialState: MarketLiveSnapshotState = {
  cropType: "",
  data: [],
  description: "",
  duration: "",
  section: "",
  title: "",
};

const marketLiveSnapshotSlice = createSlice({
  name: "marketLiveSnapshot",
  initialState,
  reducers: {
    setMarketLiveSnapshot: (
      _state,
      action: PayloadAction<MarketLiveSnapshotState>
    ) => action.payload,
  },
});

export const { setMarketLiveSnapshot } = marketLiveSnapshotSlice.actions;
export default marketLiveSnapshotSlice.reducer;
