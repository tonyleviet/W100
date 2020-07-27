import AsyncStorage from "@callstack/async-storage";


import { FirebaseService } from './FirebaseService';
const USER_KEY = "auth-demo-key";

class AuthService {

  static onSignIn(userInfo) {
    const userId = userInfo.user.id;
    const email = userInfo.user.email;
    const name = userInfo.user.name;
    const datetime = new Date();
    FirebaseService.userCollectionById(userId).get().then((querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        const { userId, name, email, phone, cityID, districtID, wardID, lastUpdate } = doc.data();
        console.log('userCollectionById querySnapshot', doc.data());
        users.push({ id: doc.id, userId, name, email, phone, cityID, districtID, wardID });
      });
      if (users.length <= 0) {
        FirebaseService.adduser(userId, name, email, null, null, null, null,null, datetime);
      }
      else {
        const currentUser = users[0];
        FirebaseService.setUser(currentUser.id, currentUser.userId, name, email, currentUser.phone,
          currentUser.cityID, currentUser.districtID, currentUser.wardID, datetime);
      }
    });
    AsyncStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  }

  static onSignOut() {
    AsyncStorage.removeItem(USER_KEY);
  }
  static updateUser(city, district, phone, address) {
    this.currentUser().then(currentUser => {
      if (currentUser) {
        FirebaseService.userCollectionById(currentUser.user.id).get().then((querySnapshot) => {
          console.log('updateUser querySnapshot', querySnapshot);
          const users = [];
          const datetime = new Date();

          querySnapshot.forEach((doc) => {
            const { userId, name, email, phone, cityID, districtID, wardID, address, lastUpdate } = doc.data();
          
            users.push({ id: doc.id, userId, name, email, phone, cityID, districtID, wardID, address });
          });
          if (users.length > 0) {
            const currentUser = users[0];
            if (!city) {
              city = currentUser.cityID;
            }
            if (!district) {
              district = currentUser.districtID;
            }
            if (!phone) {
              phone = currentUser.phone;
            }
            if (!address) {
              address = currentUser.address;
            }
            FirebaseService.setUser(currentUser.id, currentUser.userId, currentUser.name, currentUser.email, phone,
              city, district, currentUser.wardID, address, datetime);
          }

        });
      }
    });
  }
  static getUserProfile() {
    return this.currentUser().then(currentUser => {
      if (currentUser) {
        return FirebaseService.userCollectionById(currentUser.user.id).get().then((querySnapshot) => {
          const users = [];
          const datetime = new Date();

          querySnapshot.forEach((doc) => {
            const { userId, name, email, phone, cityID, districtID, wardID, address, lastUpdate } = doc.data();
            //console.log('userCollectionById querySnapshot', doc.data());
            users.push({ id: doc.id, userId, name, email, phone, cityID, districtID, wardID, address });
          });
          if (users.length > 0) {
            return users[0]
          }

        });
      }
    });
  }

  static isSignedIn() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USER_KEY)
        .then(res => {
          if (res !== null) {
            console.log('Logged User', JSON.parse(res));
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => reject(err));
    });
  }

  static currentUser() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USER_KEY)
        .then(res => {
          if (res !== null) {
            console.log('Logged User', JSON.parse(res));
            resolve(JSON.parse(res));
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  }

}

export { AuthService };