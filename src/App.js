import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Category from './components/Categories/Categories';
import Templates from './components/Product Templates/Templates';
import Products from './components/Products';
import NewTemplate from './components/New Templates/Templates';

import { Provider, connect } from "react-redux";
import { store, persistor } from "./components/New Templates/store";
import { PersistGate } from "redux-persist/integration/react";

class App extends Component {
  constructor (props) {
    super(props)
    this.state={}
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path={["/category"]} exact>
              <Category />
            </Route>
            <Route path={["/template", "/"]} exact>
              <Templates />
            </Route>
            <Route path="/product/:id" component={Products} />
              {/* <Products />
            </Route> */}
            <Route path="/newtemplate">
              <NewTemplate />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

const AppContainer = connect(({ activeNodeKey, settings }) => ({
  activeNodeKey,
  settings,
}))(App);
export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppContainer />
    </PersistGate>
  </Provider>
);


// export default App;
