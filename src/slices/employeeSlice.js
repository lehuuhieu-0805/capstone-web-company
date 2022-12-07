import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const employee = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    updateEmployee: (state, action) => {
      state = action.payload;
      return state;
    },
    reset: (state, action) => {
      state = initialState;
      return state;
    }
  }
});

const { reducer, actions } = employee;
export const { updateEmployee, reset } = actions;
export default reducer;