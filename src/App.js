import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Category from './components/Categories/Categories'
import Tree from './components/Tree'

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
            <Route path={["/category", "/"]} exact>
              <Category />
              <Tree />
            </Route>
            <Route path="/template">
              <h1>Template</h1>
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
