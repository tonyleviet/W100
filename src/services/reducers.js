import { combineReducers } from 'redux';
import shelfReducer from './shelf/reducer';
import cartReducer from './cart/reducer';
import totalReducer from './total/reducer';
import filtersReducer from './filters/reducer';
import sortReducer from './sort/reducer';
import productDetailsReducer from './productDetails/productDetailsReducer';

export default combineReducers({
  shelf: shelfReducer,
  cart: cartReducer,
  total: totalReducer,
  filters: filtersReducer,
  sort: sortReducer,
  productDetails: productDetailsReducer
});
