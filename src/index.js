import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Root from './Root';
import Routes from './Routes';
import App from './components/App';
import './index.scss';
import './static/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from './i18n';

ReactDOM.render(
  <Root i18n={i18n}>
       <App />
  </Root>,
  document.getElementById('root')  
);
