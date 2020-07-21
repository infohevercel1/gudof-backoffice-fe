import React, { Component } from 'react';
import { List, Button } from 'antd';
import axios from 'axios';

import './ProductList.css';

let selectedTemplate = null, selectedCategory = null;
class ProductList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            template_id: null,
            category_id: null
        }
    }

    async componentDidMount () {
        const query = new URLSearchParams(this.props.location.search)
        let categoryId = query.get('category');
        this.setState({categoryId})
        const { data: products } = await axios.get("https://infohebackoffice.herokuapp.com/product/category/"+categoryId)
        console.log(products)
    }

    render() {
        let listStyle = ["list-item"]
        return (
        <div className="container main-container">
        <div style={{ display: 'flex'}}>
            
        </div>
        <Button
            style={{marginLeft: '45%'}}
            href={`/addproduct?template=${this.state.template_id}&category=${this.state.category_id}`}
        >Add Product
        </Button>
        </div>
        )
    }
}

export default ProductList