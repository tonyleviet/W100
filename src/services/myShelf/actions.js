import { FirebaseService } from '../FirebaseService';
import { AuthService } from '../AuthService';
import { MY_PRODUCTS_DELETE, MY_PRODUCTS_FETCH, MY_PRODUCTS_FETCH_SUCCESS, MY_PRODUCTS_UPDATE } from './actionTypes';
//import i18n from '../i18n';

// Public


export const myProductsDelete = ({ item }) => {
  return (dispatch) => {
    /* Alert.alert(
      i18n.t('app.deleteMessage'),
      item.name,
      [
        { text: i18n.t('app.yes'), onPress: () => onPressProductsDelete(dispatch, item.id) },
        { text: i18n.t('app.cancel'), style: 'cancel' }
      ],
      { cancelable: true }
    );*/
  }; 
};
export const myProductsTotal = () => {
  return new Promise((resolve, reject) => {
    AuthService.currentUser().then(user => {
      var userId = user.Id;
      FirebaseService.allProductsCollectionByUser(userId).get().then((querySnapshot) => {
        resolve(querySnapshot.docs.length);
      });
    });
  });
};
export const myStateUpdate = ({ prop, value }) => {
  //console.log('myStateUpdate:', prop, value);
  return {
    type: MY_PRODUCTS_UPDATE,
    payload: { prop, value }
  };
};
export const myProductsPage = (pageIndex, pageSize) => {
  return new Promise((resolve, reject) => {
    AuthService.currentUser().then(user => {
      var userId = user.Id;
     console.log('myProductsPage user', user);
      FirebaseService.productsCollectionByUser(userId, pageIndex, pageSize)
        //.get()
        //.then((querySnapshot) => {
        .onSnapshot((querySnapshot) => {
          //console.log('querySnapshot', querySnapshot);
          let products = [];
          querySnapshot.forEach((doc) => {
            const { userId, imageUrls, name, price, phone, address, description,
              color, size, active, city, cityName, district, districtName, lastUpdate } = doc.data();
            //console.log('product querySnapshot.forEach', doc.data());
            let lastUpdatedDate = lastUpdate ? lastUpdate.toDate() : new Date();

            products.push({
              id: doc.id, userId, imageUrls: imageUrls, name, price, phone, address, description,
              color, size, active, city, cityName, district, districtName, lastUpdate: lastUpdatedDate
            });
            resolve(products);
          });

        });
    });
  });
};
export const myProductsFetch = (pageIndex, pageSize) => {
  return (dispatch) => {
    dispatch({ type: MY_PRODUCTS_FETCH });
    AuthService.currentUser().then(user => {
      var userId = user.Id;
      console.log('myProductsFetch currentUser', user)
      const unsubscribe = FirebaseService.productsCollectionByUser(userId, pageIndex, pageSize)
        //.get()
        //.then((querySnapshot) => {
        .onSnapshot((querySnapshot) => {
          //console.log('querySnapshot', querySnapshot);
          let products = [];
          querySnapshot.forEach((doc) => {
            const { userId, imageUrls, name, price, phone, address, description,
              color, size, active, city, cityName, district, districtName, lastUpdate } = doc.data();
            //console.log('product querySnapshot.forEach', doc.data());
            let lastUpdatedDate = lastUpdate ? lastUpdate.toDate() : new Date();

            products.push({
              id: doc.id, userId, imageUrls: imageUrls, name, price, phone, address, description,
              color, size, active, city, cityName, district, districtName, lastUpdate: lastUpdatedDate
            });
          });
          console.log('myProductsFetch myproducts', products);
          dispatch({
            type: MY_PRODUCTS_FETCH_SUCCESS,
            payload: { loading: false, myproducts: products, unsubscribe }
          });
        });
    });
  };
};

// Private

const onPressProductsDelete = (dispatch, id) => {
  FirebaseService.deleteProduct(id)
    .then(() => {
      dispatch({ type: MY_PRODUCTS_DELETE });
    })
    .catch(() => {
     /*  Alert.alert(
        i18n.t('app.attention'),
        i18n.t('app.deleteFailureMessage'),
        [{ text: i18n.t('app.ok') }],
        { cancelable: true }
      ); */
    });
};
