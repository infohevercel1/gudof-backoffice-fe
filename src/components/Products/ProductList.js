import React, { Component } from 'react';
import { List, Button } from 'antd';
import axios from 'axios';

import './ProductList.css';

let selectedTemplate = null, selectedCategory = null;
class ProductList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            templates: [],
            categories: [],
            template_id: null,
            category_id: null
        }
    }

    async componentDidMount () {
        const { data: templates } = await axios.get("https://infohebackoffice.herokuapp.com/templates")
        const { data: categories } = await axios.get("https://infohebackoffice.herokuapp.com/categories")
        this.setState({templates, categories})
    }

    productTemplateChoice = (id) => {
        this.setState({template_id: id})
    }

    categoryChoice = (id) => {
        this.setState({category_id: id})
    }

    render() {
        let listStyle = ["list-item"]
        return (
        <div className="container main-container">
        <div style={{ display: 'flex'}}>
            <div className="list-box">
                <h4 style={{ textAlign: 'center' }}>Choose Parent Category</h4>
                <List
                    className="list"
                    bordered
                    dataSource={this.state.categories}
                    renderItem={item => (
                        <List.Item
                            className={[...listStyle, this.state.category_id === item._id ? "selected-item" : null]}
                            onClick={() => this.categoryChoice(item._id)}
                        >
                            {item.name}
                        </List.Item>
                    )}
                />
            </div>
            <div className="list-box">
                <h4 style={{textAlign: 'center'}}>Choose Product Template</h4>
                <List
                    className="list"
                    bordered
                    dataSource={this.state.templates}
                    renderItem={item => (
                        <List.Item 
                            className={[...listStyle, this.state.template_id === item._id ? "selected-item" : null]} 
                            onClick={() => this.productTemplateChoice(item._id)}
                        >
                            {item.name}
                        </List.Item>
                    )}
                />
            </div>
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