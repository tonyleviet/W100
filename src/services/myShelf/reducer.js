import { MY_PRODUCTS_DELETE, MY_PRODUCTS_FETCH, MY_PRODUCTS_FETCH_SUCCESS,MY_PRODUCTS_UPDATE,STATE_UPDATE } from './actionTypes';

const initialState = {
  myproducts: [],
  cities: [],
  districts: [],
  settings: [],
  selectedCity:0,
  selectedDistrict:0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MY_PRODUCTS_DELETE:
      return state;

    case MY_PRODUCTS_FETCH:
      return initialState;
    case MY_PRODUCTS_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value
      };

    case MY_PRODUCTS_FETCH_SUCCESS:
      return {
        loading: false,
        myproducts: action.payload.myproducts,
        unsubscribe: action.payload.unsubscribe
      };
    default:
      return state;
  }
};
