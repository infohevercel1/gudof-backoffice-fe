import React, { Component } from 'react';
import { List, Button } from 'antd';
import axios from 'axios';

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
        return (
        <div style={{ margin: 'auto', width: '80%'}}>
        <div style={{ display: 'flex'}}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
                <h5 style={{textAlign: 'center'}}>Choose Product Template</h5>
                <List
                    style={{ height: '300px', overflow: 'scroll' }}
                    bordered
                    dataSource={this.state.templates}
                    renderItem={item => (
                        <List.Item onClick={() => this.productTemplateChoice(item._id)}>
                            {item.name}
                        </List.Item>
                    )}
                />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <h5 style={{ textAlign: 'center' }}>Choose Parent Category</h5>
                <List
                    style={{ height: '300px', overflow: 'scroll'}}
                    bordered
                    dataSource={this.state.categories}
                    renderItem={item => (
                        <List.Item onClick={() => this.categoryChoice(item._id)}>
                            {item.name}
                        </List.Item>
                    )}
                />
            </div>
        </div>
        <Button href={`/addproduct?template=${this.state.template_id}&category=${this.state.category_id}`}>Add Product</Button>
        </div>
        )
    }
}

export default ProductList