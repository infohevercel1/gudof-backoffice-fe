import React, { Component } from 'react';
import {instance as api} from '../../axios';
import { connect } from 'react-redux';
import { Card } from '@material-ui/core';
import { FormView } from '../ProductTemplates/views/index';
import { notification } from 'antd';
import { withAuthenticationRequired } from "@auth0/auth0-react";

import './Products.css';


class SoftProducts extends Component {
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
    
    let uiSchema = {}
    // If product is being Edited
    if (productId !== null) {
      this.setState({ productId })
      // Lock the inputs manuf, model
      uiSchema = {
        manufacturer: { "ui:readonly": true },
        model: { "ui:readonly": true}
      }
    }
    const { data: template } = await api.get("/templates/" + templateId);
    if (categoryId === 'null') {
      categoryId = template.category_id
    }
    // To remove the inline icons (Delete, etc) which are present in Template page
    this.props.updateSettings({ isInlineMode: false })
    this.props.setTree({schema: JSON.parse(template.formSchema), uiSchema})
    this.setState({ schema: JSON.parse(template.formSchema), templateId, categoryId });
  }

  submitHandler = async () => {
  try {
    let name = '', formData = this.props.formData;
    name = `${formData.manufacturer+ "-" +formData.model}`;
    const body = {
      template_id: this.state.templateId,
      category_id: this.state.categoryId,
      data: JSON.stringify(formData),
      name
    };
    let data;
    if (this.state.productId !== null) {
      body.id = this.state.productId
      data = await api.patch("/product", body);
    } else {
      data = await api.post("/product", body);
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
  settings,
  formData, 
  tree: {
    present: [{ schema }]
  }
}) => ({
  settings,
  schema,
  formData
}), (dispatch) => ({
  setTree: ({schema, uiSchema}) =>
    dispatch({
      type: 'TREE_SET_TREE',
      payload: {
        schema,
        uiSchema
      },
    }),
  setFormData: ({ formData }) =>
    dispatch({
      type: 'FORM_DATA_SET',
      payload: formData,
    }),
  updateSettings: (payload) =>
    dispatch({
      type: 'SETTINGS_UPDATE',
      payload,
    }),
}))((SoftProducts));