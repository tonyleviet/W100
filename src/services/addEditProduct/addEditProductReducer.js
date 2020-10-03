import { combineReducers } from 'redux';
import * as actions from "./addEditProductActions";

const initialState = {
    product: {
        id: 0,
        name: '',
        price: '',
        description: '',
        cityName: '',
        city: 0,
        districtName: '',
        district: 0,
        active: false,
        address: '',
        phone: '',
        color: '',
        size: '',
        imageUrls: [],
    }

}
const addEditProductReducer = (state = initialState, action) => {

    switch (action.type) {
        case actions.PRODUCT_FETCH:
            console.log('reducer initialState PRODUCT_FETCH', action.payload);

            return {
                ...state,
                product: action.payload,

                //filteredVariants: action.payload.productVariants,
                //selectableAttributes: action.payload.selectableAttributes
            };
        default:
            return state;
    }
}

export default addEditProductReducer;

