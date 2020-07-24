import React, { Component } from 'react';
import { Table, Button, notification } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';

import './ProductList.css';
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
    try {
        const query = new URLSearchParams(this.props.location.search)
        let categoryId = query.get('category');
        let products = []
        if (categoryId !== null){
            this.setState({categoryId})
            let { data } = await axios.get("https://infohebackoffice.herokuapp.com/product/category/"+categoryId)
            products = data
            this.setState({templateId: products[0].template})
        } else {
            let { data } = await axios.get("https://infohebackoffice.herokuapp.com/product/")
            products = data
        }
        // For earlier products that didn't have any data
        products = products.filter(prod => prod.data !== "{}")
        const data = products.map(product => {
            return JSON.parse(product.data);
        })
        const names = products.map(product => {
            if(product.name === undefined) {
                // For earlier products that didn't have manuf, model defined.
                product.name = '--Not defined--'
            }
            let updates = product.meta.update;
            return {
                name: product.name, 
                data: JSON.parse(product.data), 
                created_at: product.meta.created_at,
                updated_at: updates.length > 0 ? updates.slice(updates.length-1)[0].updated_at : '-',
                template: product.template,
                id: product._id,
                key: product._id
            };
        })
        const columns = [
            {
                title: 'Name', 
                dataIndex: 'name', 
                key: 'name',
                filters: names.map(prod => ({text: prod.name, value: prod.name}))
            }, {
                title: 'Created At',
                dataIndex: 'created_at',
                key: 'created_at',
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            }, {
                title: 'Update At',
                dataIndex: 'updated_at',
                key: 'updated_at',
                sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
            }
        ]
        columns.push({
            title: 'Make a Copy',
            key: 'name',
            fixed: 'right',
            width: 100,
            render: (item) => {
                return (<a onClick={async (e) => {
                    let a = await this.props.setFormData({ formData: item.data });
                    if (typeof a === 'object') {
                        setTimeout(() => {
                            let path = `addproduct?category=${this.state.categoryId}&template=${item.template._id}`;
                            window.location.href = path;
                        }, 1000)
                    }
                }}>Make a Copy</a>)
            },
        }, {
            title: 'Edit',
            key: 'name',
            fixed: 'right',
            width: 100,
            render: (item) => {
                return (<a onClick={async (e) => {
                    let a = await this.props.setFormData({ formData: item.data })
                    if (typeof a === 'object') {
                        setTimeout(() => {
                            let path = `addproduct?category=${this.state.categoryId}&template=${item.template._id}&product=${item.id}`
                            window.location.href = path;
                        }, 1000)
                    }
                }}>Edit</a>)
            },
        })
        this.setState({products: {data, names}, columns})
    } catch (e) {
        console.log(e);
        notification['error']({
            message: 'An Error Occurred',
            description: 'There was an error while displaying products.'
        })
    }
    }

    render() {
        return (
        <div className="container main-container">
        <div style={{ display: 'flex' }}>
            <Table dataSource={this.state.products.names} columns={this.state.columns} />
        </div>
        <Button
            style={{marginLeft: '45%'}}
            href={`/addproduct?template=${this.state.templateId}&category=${this.state.categoryId}`}
        >
            Add Product
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