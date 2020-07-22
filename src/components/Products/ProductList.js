import React, { Component } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

import './ProductList.css';

let selectedTemplate = null, selectedCategory = null;
class ProductList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            template_id: null,
            category_id: null,
            products: [],
            columns: []
        }
    }

    async componentDidMount () {
        const query = new URLSearchParams(this.props.location.search)
        let categoryId = query.get('category');
        this.setState({categoryId})
        let { data: products } = await axios.get("https://infohebackoffice.herokuapp.com/product/category/"+categoryId)
        products = products.filter(prod => prod.data !== "{}")
        const data = products.map(product => {
            return JSON.parse(product.data);
        })
        const columns = Object.keys(data[0]).map(key => {
            return {
                title: key,
                dataIndex: key,
                key: key
            }
        })
        this.setState({products: data, columns})
    }

    render() {
        let listStyle = ["list-item"]
        return (
        <div className="container main-container">
        <div style={{ display: 'flex'}}>
            <Table dataSource={this.state.products} columns={this.state.columns} />
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