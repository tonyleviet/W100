import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Root from './Root';
import Routes from './Routes';
import './index.scss';
import i18n from './i18n';

ReactDOM.render(
  <Root i18n={i18n}>
      <Routes/>
  </Root>,
  document.getElementById('root')  
);
