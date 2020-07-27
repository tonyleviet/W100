import AsyncStorage from "@callstack/async-storage";

const CITY_KEY = "city-key";
const DISTRICT_KEY = "district-key";
const APPSETTING_KEY = "appsetting-key";

class SettingService { 

  static storeCities(allCities) {
    AsyncStorage.setItem(CITY_KEY, JSON.stringify(allCities));
  }
  static getCities(){
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(CITY_KEY)
        .then(res => {
          if (res !== null) {
            //console.log('getCities ',JSON.parse(res));
            resolve(JSON.parse(res));
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));   
    });
  }

  static storeDistricts(allDistricts) {
    AsyncStorage.setItem(DISTRICT_KEY, JSON.stringify(allDistricts));
  }

  static getDistricts(){
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(DISTRICT_KEY)
        .then(res => {
          if (res !== null) {
            //console.log('getDistricts ',JSON.parse(res));
            resolve(JSON.parse(res));
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  }

  static storeAppSettings(allSettings) {
    AsyncStorage.setItem(APPSETTING_KEY, JSON.stringify(allSettings));
  }

  static getAppSettings(){
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(APPSETTING_KEY)
        .then(res => {
          if (res !== null) {
            //console.log('getDistricts ',JSON.parse(res));
            resolve(JSON.parse(res));
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  }

}

export { SettingService };