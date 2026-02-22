import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MetaDataState {
  currency: string;
  weight: string;
}

const initialState: MetaDataState = {
  currency: '',
  weight: '',
};

const farmLocationMetaSlice = createSlice({
  name: 'farmLocationMeta',
  initialState,
  reducers: {
    setFarmMetaData: (state, action: PayloadAction<MetaDataState>) => {
      state.currency = action.payload.currency;
      state.weight = action.payload.weight;
    },
  },
});

export const { setFarmMetaData } = farmLocationMetaSlice.actions;
export default farmLocationMetaSlice.reducer;