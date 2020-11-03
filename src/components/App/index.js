import React from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import Shelf from '../Shelf';
import Header from "../../layouts/Header"
import { Switcher } from "../../zones/Navigation"



const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey) || ''
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

const App = (props) => {
  const [defaultDistrict, setDefaultDistrict] = useStateWithLocalStorage(
    'selectedDistrict'
  );
  const [defaultCity, setDefaultCity] = useStateWithLocalStorage(
    'selectedCity'
  );
  if (!defaultDistrict) {
    defaultDistrict = 1;
  }
  if (!defaultCity) {
    defaultCity = 1;
  }
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
