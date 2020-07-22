import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Card } from '@material-ui/core';
import { FormView } from '../ProductTemplates/views/index';
import { notification } from 'antd';

import './Products.css';


class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      schema: {},
      templateId: null,
      categoryId: null,
      productId: null, // Will have value when product is edited.
    };
  }

  async componentDidMount() {
    const query = new URLSearchParams(this.props.location.search)
    let templateId = query.get('template'), 
        categoryId = query.get('category'),
        productId = query.get('product');
    
    if (productId !== null) {
      this.setState({ productId })
    }
    const { data: template } = await axios.get(
      "https://infohebackoffice.herokuapp.com/templates/" + templateId
    );
    if (categoryId === 'null') {
      categoryId = template.category_id
    }
    this.props.setTree(JSON.parse(template.formSchema))
    this.setState({ schema: JSON.parse(template.formSchema), templateId, categoryId });
  }

  submitHandler = async () => {
  try {
    let name = '', formData = this.props.formData;
    name = `${formData.manuf}-${formData.model}`;
    const body = {
      template_id: this.state.templateId,
      category_id: this.state.categoryId,
      data: JSON.stringify(formData),
      name
    };
    let data;
    if (this.state.productId !== null) {
      body.id = this.state.productId
      data = await axios.patch(
        "https://infohebackoffice.herokuapp.com/product",
        body
      );
    } else {
      data = await axios.post(
        "https://infohebackoffice.herokuapp.com/product",
        body
      );
    }
    if (data.status === 201 || data.status === 200) {
      notification['success']({
          message: 'Product Added',
          description:
            'The product has been added to the database!',
        });
      this.props.setFormData({formData: {}})
    } else {
      notification['error']({
        message: 'An Error Occurred',
        description: 'The product was not saved to the database. Please try again later.'
      })
    }
  } catch (e) {
    notification['error']({
      message: 'An Error Occurred',
      description: 'The product was not saved to the database. Please try again later.'
    })
  }
  };

  render() {
    console.log(this.props.formData)
    return (
      <div className="product">
        <h4>Form Page</h4>
        <h5>{this.state.productId ? 'Edit Product' : 'Add New Product'}</h5>
        <Card variant="elevation" raised className="card">
          <FormView
            formData={this.props.formData}
            schema={this.props.schema}
            onSubmit={this.submitHandler}
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ 
  formData, 
  tree: {
    present: [{ schema }]
  }
}) => ({
  schema,
  formData
}), (dispatch) => ({
  setTree: (schema) =>
    dispatch({
      type: 'TREE_SET_TREE',
      payload: {
        schema,
      },
    }),
  setFormData: ({ formData }) =>
    dispatch({
      type: 'FORM_DATA_SET',
      payload: formData,
    }),
}))(Products);