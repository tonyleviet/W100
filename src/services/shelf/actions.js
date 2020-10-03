import { FETCH_PRODUCTS, STATE_UPDATE } from './actionTypes';
import { FirebaseService } from '../FirebaseService';

const compare = {
  lowestprice: (a, b) => {
    if (a.price < b.price) return -1;
    if (a.price > b.price) return 1;
    return 0;
  },
  highestprice: (a, b) => {
    if (a.price > b.price) return -1;
    if (a.price < b.price) return 1;
    return 0;
  }
};
export const stateUpdate = ({ prop, value }) => {
  return {
    type: STATE_UPDATE,
    payload: { prop, value }
  };
};
export const fetchProducts = (pageIndex, pageSize, cityID, districtID, callback) => dispatch => {
  console.log('action fetchProducts', pageIndex, '--', pageSize, 'cityID:', cityID, ' districtID: ', districtID);
  return FirebaseService.activeProductsCollection(pageIndex, pageSize, cityID, districtID).get()
    .then(querySnapshot => {
      let products = [];
     
      querySnapshot.forEach((doc) => {
        const { userId, imageUrls, name, price, phone, address, description,
          color, size, active, city, cityName, district, districtName, lastUpdate } = doc.data();
        //console.log('product querySnapshot.forEach', doc.data());
        let lastUpdatedDate = lastUpdate ? lastUpdate.toDate() : new Date();
        products.push({
          id: doc.id, userId: null, imageUrls: imageUrls, name, price, phone, address, description: description,
          color, size, active, city, cityName, district, districtName, lastUpdate: lastUpdatedDate
        });
      });
      if (!!callback) {
        callback();
      }
      console.log('action fetchProducts products', products);
      return dispatch({
        type: FETCH_PRODUCTS,
        payload: products
      });
    });
};
