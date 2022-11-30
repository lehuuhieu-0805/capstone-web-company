import { createSlice } from '@reduxjs/toolkit';

const premium = createSlice({
  name: 'premiums',
  initialState: false,
  reducers: {
    updatePremium: (state, action) => {
      state = action.payload;
      return state;
    },
  }
});

const { reducer, actions } = premium;
export const { updatePremium } = actions;
export default reducer;