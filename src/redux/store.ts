import { configureStore } from "@reduxjs/toolkit";
import { authReducer, etalaseReducer } from "./slices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    etalase: etalaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
