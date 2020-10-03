import React from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import Shelf from '../Shelf';
import Header from "../../layouts/Header"
import { Switcher } from "../../zones/Navigation"




const App = (props) => {

  console.log('App Component', props);
  return (
    <Router >
      <Header />
      <Switcher />
    </Router>
  )
};

export default App;
