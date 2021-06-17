import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from '@auth0/auth0-react';
import SignIn from './items/Auth/Signin';

ReactDOM.render(
  // <React.StrictMode>
  <Auth0Provider
  domain="gudof-dev-app.us.auth0.com"
  clientId="SPadl4RZ9YsM8y64CdlWSxjjKV23xqnO"
  // redirectUri={'http://localhost:3000/category'}
    redirectUri={'http://dashboard.gudof.com/category'}

>
    <App />
    {/* <SignIn/> */}
    </Auth0Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
