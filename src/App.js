import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import "./index.css";
import Category from './components/Categories/Categories';
import Products from './components/Products';
import NewTemplate from './components/ProductTemplates/Templates.jsx';
import ProductList from './components/Products/List/ProductList';

import { Provider, connect } from "react-redux";
import { store, persistor } from "./components/ProductTemplates/store";
import { PersistGate } from "redux-persist/integration/react";
import { Menu } from "antd";
import {
  ContainerOutlined,
  UnorderedListOutlined,
  DatabaseFilled,
} from "@ant-design/icons";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "category",
    };
  }

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <Router>
        <div className="App">
          <Menu
            onClick={this.handleClick}
            selectedKeys={[current]}
            mode="horizontal"
          >
            <Menu.Item key="category" icon={<UnorderedListOutlined />}>
              <Link to="/category">Categories</Link>
            </Menu.Item>
            <Menu.Item key="template" icon={<ContainerOutlined />}>
              <Link to="/template">Product Templates</Link>
            </Menu.Item>
            <Menu.Item key="product" icon={<DatabaseFilled />}>
              <Link to="/product">Products</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route path={["/category", "/"]} exact>
              <Category />
            </Route>
            <Route path="/template" component={NewTemplate} />
            <Route path="/product" component={ProductList} />
            <Route path="/addproduct/" component={Products} />
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
