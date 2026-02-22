import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface SensorFarmLevelReading {
  temperature?: number;
  humidity?: number;
  co2?: number;
  updatedAt: string;
}

export interface SensorState {
  [farm_id: string]: {
    farm_level_sensor_latestreading: SensorFarmLevelReading;
  };
}

const initialState: SensorState = {};

const sensorFarmLevelSlice = createSlice({
  name: "sensorFarmLevel",
  initialState,
  reducers: {
    updateFarmLevelSensor: (
      state,
      action: PayloadAction<{
        farm_id: string;
        reading: Partial<Omit<SensorFarmLevelReading, "updatedAt">>;
      }>
    ) => {
      const { farm_id, reading } = action.payload;
      const current = state[farm_id]?.farm_level_sensor_latestreading || {
        temperature: undefined,
        humidity: undefined,
        co2: undefined,
        updatedAt: "",
      };
      state[farm_id] = {
        farm_level_sensor_latestreading: {
          ...current,
          ...reading,
          updatedAt: new Date().toISOString(),
        },
      };
    },
  },
});

export const { updateFarmLevelSensor } = sensorFarmLevelSlice.actions;

export const selectFarmSensorData = (state: RootState, farmId: string) =>
  state.sensorFarmLevel?.[farmId]?.farm_level_sensor_latestreading;

export default sensorFarmLevelSlice.reducer;
