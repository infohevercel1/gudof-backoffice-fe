import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Category from './components/Categories/Categories';
import Templates from './components/Product Templates/Templates';

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
            <Route path="/product">
              <h1>Product</h1>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
