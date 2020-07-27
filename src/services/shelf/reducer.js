import { FETCH_PRODUCTS ,STATE_UPDATE} from './actionTypes';

const initialState = {
  products: [],
  cities: [],
  districts: [],
  settings: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
    case STATE_UPDATE:
      return {
        ...state,
        [action.payload.prop]: action.payload.value
      };
    default:
      return state;
  }
}
