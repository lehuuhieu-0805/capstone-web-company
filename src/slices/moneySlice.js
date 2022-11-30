import { createSlice } from '@reduxjs/toolkit';

const money = createSlice({
  name: 'moneys',
  initialState: 0,
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
    }
  }
});

const { reducer, actions } = money;
export const { updateMoney, minusMoney, addMoney } = actions;
export default reducer;