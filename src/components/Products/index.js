import React, { Component } from 'react';
import axios from 'axios';
import Form from "@rjsf/material-ui";
import { Card } from '@material-ui/core';

import './Products.css';

class Products extends Component {

    constructor (props) {
        super(props)
        this.state = {
            formData: {},
            schema: {},
            templateId: ''
        }
    }

    async componentDidMount () {
        let id = this.props.match.params.id
        const {data: template} = await axios.get('https://infohebackoffice.herokuapp.com/templates/'+id)
        this.setState({schema: JSON.parse(template.formSchema), templateId: id})
    }

    submitHandler = async () => {
        const body = {
            template_id: this.state.templateId,
            data: JSON.stringify(this.state.formData)
        }
        const data = await axios.post('https://infohebackoffice.herokuapp.com/product', body)
        if(data.status === 201) {
            alert('Product Added')
        }
    }

    render() {
        console.log(this.state.formData)
        return (
            <div className="product">
                <Card variant="elevation" raised className="card">
                    <h4>Form Page</h4>
                    <Form
                        schema={this.state.schema}
                        formData={this.state.formData}
                        onSubmit={this.submitHandler}
                    />
                </Card>
            </div>
        )
    }
}

export default Products;