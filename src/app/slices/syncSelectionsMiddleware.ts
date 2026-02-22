import { Middleware } from "@reduxjs/toolkit";
import { removeCrop, clearBasket } from "./growBasketSlice";
import { logout } from "./authSlice";
import {
  removeCropSelectionByNameVariety,
  clearSelections,
} from "./cropSelectionSlice";

interface CropInfo {
  name: string;
  variety: string;
}
interface SyncState {
  growBasket: {
    basket: CropInfo[];
  };
}

export const syncSelectionsMiddleware: Middleware<{}, SyncState> =
  (storeAPI) => (next) => (action) => {
    const stateBefore = storeAPI.getState();
    let removedCrop: { name: string; variety: string } | null = null;

    if (removeCrop.match(action)) {
      const index = action.payload;
      const cropList = stateBefore.growBasket.basket;
      if (index >= 0 && index < cropList.length) {
        removedCrop = {
          name: cropList[index].name,
          variety: cropList[index].variety,
        };
      }
    }

    const result = next(action);

    if (removedCrop) {
      storeAPI.dispatch(removeCropSelectionByNameVariety(removedCrop));
    }

    if (clearBasket.match(action) || logout.match(action)) {
      storeAPI.dispatch(clearSelections());
    }

    return result;
};
