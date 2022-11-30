import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const company = createSlice({
  name: 'companys',
  initialState,
  reducers: {
    updateCompany: (state, action) => {
      state = action.payload;
      return state;
    },
    reset: (state, action) => {
      state = initialState;
      return state;
    }
  }
});

const { reducer, actions } = company;
export const { updateCompany, reset } = actions;
export default reducer;