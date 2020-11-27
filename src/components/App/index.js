import React from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import Shelf from '../Shelf';
import Header from "../../layouts/Header"
import { Switcher } from "../../zones/Navigation"
import { SettingService } from '../../services/SettingService';
import { FirebaseService } from '../../services/FirebaseService';


const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey) || ''
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};
const handleSetttings = () => {
  SettingService.getAppSettings().then(results => {
    if (!results) {
      FirebaseService.settingsCollection()
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //console.log('FirebaseService.settingsCollection doc', doc);  
            const { ActiveAfter, ExpireAfter } = doc.data();
            if (doc.id == "AppSettings") {
              let appSettings = {
                ActiveAfter: ActiveAfter,
                ExpireAfter: ExpireAfter
              }
              console.log('FirebaseService.settingsCollection appSettings', appSettings);
              SettingService.storeAppSettings(appSettings);
              //props.stateUpdate({prop:"settings", value: appSettings})
            }
          });
        });
    }
  });
  SettingService.getCities().then(results => {
    if (!results) {
      FirebaseService.citiesCollection().get().then((querySnapshot) => {
        const cityData = [];
        cityData.push({ value: 0, label: 'Select a city', Order: 0 });
        querySnapshot.forEach((doc) => {
          const { CityID, City, Order } = doc.data();
          cityData.push({ value: CityID, label: City, Order });
        });
        console.log('FirebaseService.settingsCollection cityData', cityData);
        SettingService.storeCities(cityData);
        //props.stateUpdate({prop:"cities",value: cityData});
        //cities = cityData;
      });
    }
  });

  SettingService.getDistricts().then(results => {
    if (!results) {
      FirebaseService.districtsCollection()
        .get().then((querySnapshot) => {
          const districtData = [];
          districtData.push({ CityID: 0, City: '', value: 0, label: 'Select a city first', Order: 0 });
          querySnapshot.forEach((doc) => {
            const { CityID, City, DistrictID, District, Order } = doc.data();
            districtData.push({ CityID, City, value: DistrictID, label: District, Order });
          });
          console.log('FirebaseService.settingsCollection districtData', districtData);
          SettingService.storeDistricts(districtData);
          //props.stateUpdate({prop:"districts", value: districtData});
        });
    }
  });
};
const App = (props) => {
  var [defaultDistrict, setDefaultDistrict] = useStateWithLocalStorage(
    'selectedDistrict'
  );
  var [defaultCity, setDefaultCity] = useStateWithLocalStorage(
    'selectedCity'
  );
  if (!defaultDistrict) {
    defaultDistrict = 1;
  }
  if (!defaultCity) {
    defaultCity = 1;
  }

  handleSetttings();
  //const onChange = event => setDefaultDistrict(event.target.value);
  console.log('App Component', props);
  return (
    <Router >
      <Header defaultCity={defaultCity} defaultDistrict={defaultDistrict} />
      <Switcher defaultCity={defaultCity} defaultDistrict={defaultDistrict} />
    </Router>
  )
};

export default App;
