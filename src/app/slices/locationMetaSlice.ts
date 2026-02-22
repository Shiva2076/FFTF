import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MetaDataState {
  currency: string;
  weight: string;
}

const initialState: MetaDataState = {
  currency: '',
  weight: '',
};

const locationMetaSlice = createSlice({
  name: 'locationMeta',
  initialState,
  reducers: {
    setMetaData: (state, action: PayloadAction<MetaDataState>) => {
      state.currency = action.payload.currency;
      state.weight = action.payload.weight;
    },
  },
});

export const { setMetaData } = locationMetaSlice.actions;
export default locationMetaSlice.reducer;