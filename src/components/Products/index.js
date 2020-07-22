import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Card, Snackbar } from '@material-ui/core';
import { Alert as MuiAlert } from "@material-ui/lab";
import { FormView } from '../ProductTemplates/views/index';
import { notification } from 'antd';

import './Products.css';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      schema: {},
      templateId: null,
      categoryId: null,
      productAdded: false,
    };
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    
    this.setState({ productAdded: false });
  };

  async componentDidMount() {
    const query = new URLSearchParams(this.props.location.search)
    let templateId = query.get('template'), categoryId = query.get('category')
    const { data: template } = await axios.get(
      "https://infohebackoffice.herokuapp.com/templates/" + templateId
    );
    if (categoryId === null) {
      categoryId = template.category_id
    }
    this.props.setTree(JSON.parse(template.formSchema))
    this.setState({ schema: JSON.parse(template.formSchema), templateId, categoryId });
  }

  submitHandler = async () => {
  try {
    let name = '', formData = this.props.formData;
    if(formData.manuf && formData.model) {
      name = `${formData.manuf}-${formData.model}`;
    } else {
      name = `product-for-template-${this.state.templateId}`;
    }
    const body = {
      template_id: this.state.templateId,
      category_id: this.state.categoryId,
      data: JSON.stringify(formData),
      name
    };
    const data = await axios.post(
        "https://infohebackoffice.herokuapp.com/product",
        body
      );
    if (data.status === 201) {
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
        <Card variant="elevation" raised className="card">
          <h4>Form Page</h4>
          <FormView
            schema={this.props.schema}
            onSubmit={this.submitHandler}
          />
        </Card>
        <Snackbar
          open={this.state.productAdded}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <Alert onClose={this.handleClose} severity="success">
            New Product Saved!
          </Alert>
        </Snackbar>
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