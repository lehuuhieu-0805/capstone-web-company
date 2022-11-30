import { createSlice } from '@reduxjs/toolkit';

const company = createSlice({
  name: 'companys',
  initialState: null,
  reducers: {
    updateCompany: (state, action) => {
      state = action.payload;
      return state;
    },
  }
});

const { reducer, actions } = company;
export const { updateCompany } = actions;
export default reducer;