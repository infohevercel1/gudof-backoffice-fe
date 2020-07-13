import React, { Component } from 'react';
import axios from 'axios';
import Form from "@rjsf/core";
import { Card, Snackbar } from '@material-ui/core';
import { Alert as MuiAlert } from "@material-ui/lab";

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
    this.setState({ schema: JSON.parse(template.formSchema), templateId, categoryId });
  }

  submitHandler = async () => {
    this.setState({ productAdded: false });
    const body = {
      template_id: this.state.templateId,
      category_id: this.state.categoryId,
      data: JSON.stringify(this.state.formData),
    };
    const data = await axios.post(
      "https://infohebackoffice.herokuapp.com/product",
      body
    );
    if (data.status === 201) {
      this.setState({ productAdded: true });
    }
  };

  render() {
    console.log(this.state.formData);
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

export default Products;