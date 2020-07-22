import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';

import './ProductList.css';

let selectedTemplate = null, selectedCategory = null;
class ProductList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            templateId: null,
            categoryId: null,
            products: {
                data: [],
                names: []
            },
            columns: []
        }
    }

    async componentDidMount () {
        const query = new URLSearchParams(this.props.location.search)
        let categoryId = query.get('category');
        this.setState({categoryId})
        let { data: products } = await axios.get("https://infohebackoffice.herokuapp.com/product/category/"+categoryId)
        // For earlier products that didn't have any data
        products = products.filter(prod => prod.data !== "{}")
        const data = products.map(product => {
            return JSON.parse(product.data);
        })
        console.log(products[0]);
        this.setState({templateId: products[0].template})
        const names = products.map(product => {
            if(product.name === undefined) {
                // For earlier products that didn't have manuf, model defined.
                product.name = '--Not defined--'
            }
            return {name: product.name, data: JSON.parse(product.data)};
        })
        // const columns = Object.keys(data[0]).map(key => {
        //     return {
        //         title: key,
        //         dataIndex: key,
        //         key: key
        //     }
        // });
        const columns = [{title: 'Name', dataIndex: 'name', key: 'name'}]
        columns.push({
            title: 'Make a Copy',
            key: 'name',
            fixed: 'right',
            width: 100,
            render: (t) => {
                return (<a onClick={(e) => {
                    console.log()
                    this.props.setFormData({formData: t.data})
                    let path = `addproduct?category=${this.state.categoryId}&template=${this.state.templateId}`
                    window.location.href = path;
                }}>Make a Copy</a>)
            },
        })
        this.setState({products: {data, names}, columns})
    }

    render() {
        let listStyle = ["list-item"]
        return (
        <div className="container main-container">
        <div style={{ display: 'flex'}}>
            <Table dataSource={this.state.products.names} columns={this.state.columns} />
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

export default connect(({
    formData
}) => ({
    formData
}), (dispatch) => ({
    setFormData: ({ formData }) =>
        dispatch({
            type: 'FORM_DATA_SET',
            payload: formData,
        }),
}))(ProductList);