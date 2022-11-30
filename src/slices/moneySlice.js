import { createSlice } from '@reduxjs/toolkit';

const initialState = 0;

const money = createSlice({
  name: 'moneys',
  initialState,
  reducers: {
    updateMoney: (state, action) => {
      state = action.payload;
      return state;
    },
    minusMoney: (state, action) => {
      state -= action.payload;
      return state;
    },
    addMoney: (state, action) => {
      state += action.payload;
      return state;
    },
    reset: (state, action) => {
      state = initialState;
      return state;
    }
  }
});

const { reducer, actions } = money;
export const { updateMoney, minusMoney, addMoney, reset } = actions;
export default reducer;