import { FETCH_PRODUCTS, STATE_UPDATE } from './actionTypes';
import axios from 'axios';
import { FirebaseService } from '../FirebaseService';
import { productsAPI } from '../util';

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
export const fetchProducts = (filters, sortBy, callback) => dispatch => {

  return FirebaseService.activeProductsCollection(1, 10, 79, 0).get()
    .then(querySnapshot => {
      // let { products } = res.data;
      let products = [];
      //if(currentProducts){
      //  products=currentProducts
      //}
      //if(this.props)
     
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
      return dispatch({
        type: FETCH_PRODUCTS,
        payload: products
      });
    }); 
  /* return axios
    .get(productsAPI)
    .then(res => {
      let { products } = res.data;

      if (!!filters && filters.length > 0) {
        products = products.filter(p =>
          filters.find(f => p.availableSizes.find(size => size === f))
        );
      }

      if (!!sortBy) {
        products = products.sort(compare[sortBy]);
      }

      if (!!callback) {
        callback();
      }

      return dispatch({
        type: FETCH_PRODUCTS,
        payload: products
      });
    })
    .catch(err => {
      console.log('Could not fetch products. Try again later.');
    }); */
};
