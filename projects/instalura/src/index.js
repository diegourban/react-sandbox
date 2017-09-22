import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import Login from './components/Login';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

ReactDOM.render(
  (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/timeline" component={App} />
      </Switch>
    </BrowserRouter>
  ),
  document.getElementById('root')
);
