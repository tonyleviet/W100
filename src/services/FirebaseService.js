import md5 from 'md5';
import firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/firestore";

import { FirebaseApp } from "./FirebaseApp";
class FirebaseService {
  /* Initialize Firebase */


  static async signIn(idToken, accessToken) {
    const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
    console.log('FirebaseService credential', credential);
    return await FirebaseApp.auth().signInWithCredential(credential);
  }

  static async signOut() {
    return await FirebaseApp.auth().signOut();
  }

  static addProduct(userId, imageUrls, city, cityName, district, districtName, name,
    price, phone, address, description, color, size, active) {

    const datetime = new Date();
    let productToAdd = {
      userId, imageUrls, city, cityName, district, districtName, name,
      price, phone, address, description, color, size, active, lastUpdate: datetime
    };

    console.log("addProduct :" + userId + "-", productToAdd);
    return this.productsCollection().add(productToAdd);
  }

  static setProduct(id, userId, imageUrls, city, cityName, district, districtName, name,
    price, phone, address, description, color, size, active) {
    //  console.log("setProduct :",productToUpdate);
    const datetime = new Date();
    let productToUpdate = {
      userId, imageUrls, city, cityName, district, districtName, name,
      price, phone, address, description, color, size, active, lastUpdate: datetime
    };

    return this.productsCollection().doc(id).set(productToUpdate);
  }

  static deleteProduct(id) {
    return this.productsCollection().doc(id).delete();
  }


  static getProduct(productId) {
    return this.productsCollection().doc(productId)
  }

  static productsCollection() {
    return FirebaseApp.firestore().collection('products');
  }
  static settingsCollection() {
    return FirebaseApp.firestore().collection('settings');
  }

  static activeProductsCollection(pageIndex, pageSize, cityID, districtID) {
    //let pageSize = 10;
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const last30Days = new Date(year, month - 1, day) // Subtract 1 MONTH
    const nextTotalItems = (pageIndex) * pageSize;
    //console.log("activeProductsCollection skip:", nextTotalItems, " pageSize:", pageSize)

    //const total =   this.productsCollection().get().then(res => console.log(res.size));
    //console.log("total", total);
    //if(nextTotalItems>total){
    //  nextTotalItems=total; 
    //}
    if (districtID !== 0) {
      return this.productsCollection()
        .where("active", "==", true)
        .where("city", "==", cityID)
        .where("district", "==", districtID)
        .orderBy("lastUpdate", "desc")
        //.startAt(skip) 
        .limit(nextTotalItems);
    }
    else {
      return this.productsCollection()
        .where("active", "==", true)
        .where("city", "==", cityID)
        .orderBy("lastUpdate", "desc")
        //.startAt(skip) 
        .limit(nextTotalItems);
        
    }

  }
  static productsCollectionByUser(userId, pageIndex, pageSize) {
    const nextTotalItems = (pageIndex) * pageSize;
    //console.log("productsCollectionByUser nextTotalItems", nextTotalItems);
    return this.productsCollection()
      .where("userId", "==", userId)
      .orderBy("lastUpdate", "desc")
      .limit(nextTotalItems);
    ;
  }
  static allProductsCollectionByUser(userId) {
    return this.productsCollection()
      .where("userId", "==", userId);
  }
  static citiesCollection() {
    return FirebaseApp.firestore().collection('city').orderBy('Order');
  }
  static districtsCollection() {
    return FirebaseApp.firestore().collection('district').orderBy('Order');
  }


  static userCollectionById(userId) {
    return FirebaseApp.firestore().collection('users').where("userId", "==", userId);
  }

  static adduser(userId, name, email, phone, cityID, districtID, wardID, address, datetime) {
    //console.log("addProduct :"+userId+"-");
    return FirebaseApp.firestore().collection('users').add({ userId, name, email, phone, cityID, districtID, wardID, address, lastUpdate: datetime });
  }

  static setUser(docId, userId, name, email, phone, cityID, districtID, wardID, address, datetime) {
    console.log("setProduct :" + docId + "-" + userId + "-" + datetime + "-");
    return FirebaseApp.firestore().collection('users').doc(docId).set({ userId, name, email, phone, cityID, districtID, wardID, address, lastUpdate: datetime });
  }

  static uploadImage(path) {
    const id = imageId();
    const metadata = { cacheControl: 'public,max-age=604800', contentType: 'image/jpeg' };
    return FirebaseApp.storage().ref(`/products/images/${id}.jpg`).putFile(path, metadata);


  }

  static uploadImageBase64(base64) {
    const id = imageId();
    const metadata = { cacheControl: 'public,max-age=604800', contentType: 'image/jpeg' };
    console.log('uploadImageBase64 base64', base64);
    return FirebaseApp.storage().ref(`/products/images/${id}.jpg`).putString(base64.substring(23), 'base64', { contentType: 'image/jpg' });


  }
}

// used only to generate a unique id
// ideally, the server would generate this unique id
function imageId() {
  const uniqueID = 1;
  const date = Date.parse(Date());
  return md5(`${uniqueID}-${date}`);
}

export { FirebaseService };
