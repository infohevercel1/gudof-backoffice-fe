import { UnorderedListOutlined ,ContainerOutlined,DatabaseFilled} from '@ant-design/icons'
// import { Link } from '@material-ui/core'
import React  from 'react'
import { Delete } from "@material-ui/icons";
import { Menu, Layout, Button } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { URL_LOCAL } from '..';

export default function (handleClick,current) {
    const auth = useAuth0()
    const {isAuthenticated} = auth
    return(
        <Menu
        theme="dark"
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
       {isAuthenticated && <Menu.Item key="category" icon={<UnorderedListOutlined />}>
          <Link to="/category">Categories</Link>
        </Menu.Item>}
        {isAuthenticated &&<Menu.Item key="template" icon={<ContainerOutlined />}>
          <Link to="/viewtemplates">Product Templates</Link>
        </Menu.Item>}
        {isAuthenticated &&<Menu.Item key="product" icon={<DatabaseFilled />}>
          <Link to="/product">Products</Link>
        </Menu.Item>}
        {/* <Menu.Item key="product" icon={<DatabaseFilled />}></Menu.Item> */}
        {isAuthenticated &&<Menu.Item key="soft" icon={<Delete />}>
          <Link to="/softdeleted">Soft Deleted Products</Link>
        </Menu.Item>}
        {!isAuthenticated && <Menu.Item key="login" icon={<UnorderedListOutlined />}>
          <Link to="/">Login</Link>
        </Menu.Item>}
        {isAuthenticated && <Menu.Item key="login">
          <Button onClick={()=>auth.logout({
            //   returnTo:'http://localhost:3000'
            returnTo:`http://${URL_LOCAL}`
              })}>Logout</Button>
        </Menu.Item>}
      </Menu>
    )
}