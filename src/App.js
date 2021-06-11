import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import { instance as api } from "./axios.js";

import Category from "./items/Categories/Categories";
import Products from "./items/Products";
import NewTemplate from "./items/ProductTemplates/Templates.jsx";
import List from "./items/ProductTemplates/List";
import ProductList from "./items/Products/List/ProductList";
import { Provider, connect } from "react-redux";
import { store, persistor } from "./items/ProductTemplates/store";
import { PersistGate } from "redux-persist/integration/react";
import {  Layout } from "antd";

import SoftProductList from "./items/SoftDeletedProducts/List/ProductList";

import Signin from "./items/Auth/Signin";
import Navbar from "./items/Navbar";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "category",
      categname: "",
      isAuthenticated:true,
    };
  }

  componentWillMount() {
    require('dotenv').config()
    // const auth = useAuth0();
    // this.setState({isAuthenticated:auth.isAuthenticated})
    const pathname = window.location.pathname,
      secondslash = pathname.indexOf("/", 1) > 0 ? pathname.indexOf("/", 1) + 1 : -1;
    let location;
    if (secondslash === -1) {
      location = pathname.slice(1);
    } else {
      location = pathname.slice(1, secondslash);
    }
    location = location === "" ? "category" : location;
    location = location === "addproduct" ? "product" : location;
    location = location === "viewtemplates" ? "template" : location;
    this.setState({ current: location });
  }

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };
  handleFiles = async (file, category_name) => {
    const fData = new FormData();
    fData.append("file", file[0], file[0].name);
    let resp = await api.post(`/user/fileupload/${category_name}`, fData);
    console.log(resp)
  };
  render() {
    
    const { current } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar handleFiles={this.handleFiles} current={current}/>
          <Layout>
            <Content>
      
              {/* <Route path={["/category", "/"]} exact> */}
              <Route path={"/category"}>

                <Category />
              </Route>
              <Route exact path="/" component={Signin} />
              <Route path="/template" component={NewTemplate} />
              <Route path="/viewtemplates" component={List} />
              <Route path="/product" component={ProductList} />
              <Route path="/addproduct/" component={Products} />
              <Route path="/softdeleted" component={SoftProductList}/>
            </Content>
          </Layout>
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
