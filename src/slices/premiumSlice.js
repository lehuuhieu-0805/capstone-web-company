import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

const premium = createSlice({
  name: 'premiums',
  initialState,
  reducers: {
    updatePremium: (state, action) => {
      state = action.payload;
      return state;
    },
    reset: (state, action) => {
      state = initialState;
      return state;
    }
  }
});

const { reducer, actions } = premium;
export const { updatePremium, reset } = actions;
export default reducer;