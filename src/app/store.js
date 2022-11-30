import { configureStore } from '@reduxjs/toolkit';
import moneyReducer from '../slices/moneySlice';
import premiumReducer from '../slices/premiumSlice';
import companyReducer from '../slices/companySlice';

const rootReducer = {
  moneys: moneyReducer,
  premiums: premiumReducer,
  companys: companyReducer
};

const store = configureStore({
  reducer: rootReducer
});

export default store;