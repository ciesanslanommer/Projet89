import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Admin from './adminComponent/Admin.js';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

console.log("hello", process.env.PUBLIC_URL)
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path={process.env.PUBLIC_URL + ''}>
          <App />
        </Route>
        <Route path={process.env.PUBLIC_URL + '/admin'}>
          <Admin />
        </Route>

        <Route path={process.env.PUBLIC_URL + '/preview'}>
          <App preview />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
