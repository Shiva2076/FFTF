import { configureStore, combineReducers, StateFromReducersMapObject } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import growBasketReducer from "./slices/growBasketSlice";
import cropGrowingGuideReducer from "./slices/cropGrowingGuideSlice";
import cropsByRegionReducer from "./slices/cropsByRegionSlice";
import sensorFarmLevelReducer from "./slices/sensorFarmLevelSlice";
import { apiSlice } from "./slices/apiSlice";
import cropSelectionReducer from "./slices/cropSelectionSlice";
import { syncSelectionsMiddleware } from "./slices/syncSelectionsMiddleware";
import locationMetaReducer from "./slices/locationMetaSlice";
import marketLiveSnapshotReducer from "./slices/marketLiveSnapshotSlice";
import farmLocationMetaReducer from "./slices/farmLocationMetaSlice";
import selectedCropTypeReducer from "./slices/selectedCropTypeSlice";
// import userReducer from "./slices/userSlice";

const reducers = {
  auth: authReducer,
  growBasket: growBasketReducer,
  cropGrowingGuide: cropGrowingGuideReducer,
  cropsByRegion: cropsByRegionReducer,
  sensorFarmLevel: sensorFarmLevelReducer,
  cropSelection: cropSelectionReducer,
  locationMeta: locationMetaReducer,
  marketLiveSnapshot: marketLiveSnapshotReducer,
  farmLocationMeta: farmLocationMetaReducer,
  selectedCropTypetab: selectedCropTypeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
};

const rootReducer = combineReducers(reducers);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "growBasket", "cropGrowingGuide", "cropsByRegion", "sensorFarmLevel","locationMeta", "marketLiveSnapshot", "farmLocationMeta"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, syncSelectionsMiddleware),
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;