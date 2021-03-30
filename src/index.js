import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Admin from './adminComponent/Admin.js';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Switch, Route } from 'react-router-dom';

console.log("hello", process.env.PUBLIC_URL)
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path='/'>
          <App />
        </Route>
        <Route path='/admin'>
          <Admin />
        </Route>

        <Route path='/preview'>
          <App preview />
        </Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
