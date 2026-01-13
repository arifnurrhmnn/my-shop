import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Etalase } from "@/types";

interface EtalaseState {
  items: Etalase[];
  loading: boolean;
  hasMore: boolean;
}

const initialState: EtalaseState = {
  items: [],
  loading: false,
  hasMore: true,
};

const etalaseSlice = createSlice({
  name: "etalase",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Etalase[]>) => {
      state.items = action.payload;
    },
    appendItems: (state, action: PayloadAction<Etalase[]>) => {
      state.items = [...state.items, ...action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    resetEtalase: (state) => {
      state.items = [];
      state.loading = false;
      state.hasMore = true;
    },
  },
});

export const { setItems, appendItems, setLoading, setHasMore, resetEtalase } =
  etalaseSlice.actions;
export default etalaseSlice.reducer;
