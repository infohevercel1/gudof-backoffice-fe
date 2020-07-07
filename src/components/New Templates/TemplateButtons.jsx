import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import axios from "axios";
import { connect } from "react-redux";

class TemplateButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      templates: [],
      existingTemplate: false,
      templateId: null
    };
  }

  async componentDidMount () {
      const { data: templates } = await axios.get(
        "https://infohebackoffice.herokuapp.com/templates"
      );
      this.setState({ templates });
  }

  renderThisTemplate = async (_id) => {
    console.log('Calling this function')
    console.log(this.props.tree)
    let [thisTemplate] = this.state.templates.filter(template => template._id === _id)
    console.log(thisTemplate)
    let schema = JSON.parse(thisTemplate.formSchema),
      uiSchema = this.props.tree.present[0].uiSchema,
      name = thisTemplate.name
    this.props.setTree({ name, schema, uiSchema });
    this.setState({ visible: false, existingTemplate: true, templateId: thisTemplate._id})
  }

  postToBackend = async (e) => {
    const schema = this.props.tree.present[0].schema,
      uiSchema = this.props.tree.present[0].uiSchema,
      category_id = "5ef5e95f6d957a00173e32b5", // Temp
      body = {
        name: schema.title ? schema.title : "New Product Template",
        category_id,
        formSchema: JSON.stringify(schema),
        uiSchema: uiSchema ? JSON.stringify(uiSchema): "",
      };
    const resp = await axios.post(
      "https://infohebackoffice.herokuapp.com/templates",
      body
    );
    const response = resp.status;
    if (response === 201) {
      alert("Template Created");
    }
  };

  showTemplates = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Button style={{ marginLeft: "2%" }} onClick={this.postToBackend}>
          Add Template
        </Button>
        <Button style={{ marginLeft: "2%" }} onClick={this.showTemplates}>
          View Templates
        </Button>
        <Modal
          title="View Existing Templates"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button key="back" onClick={this.handleOk}>
              Okay
            </Button>,
          ]}
        >
          <ul>
            {this.state.templates.map((template) => (
              <li key={template._id} onClick={() => this.renderThisTemplate(template._id)}>{template.name}</li>
            ))}
          </ul>
        </Modal>
        {this.state.existingTemplate ? (
          <Button style={{marginLeft: '2%'}} href={"/product/" + this.state.templateId}>Add Product for this Template</Button>
        ): null}
      </>
    );
  }
}

export default connect(
  ({ tree }) => ({ tree }),
  (dispatch) => ({
    setTree: (payload) =>
      dispatch({
        type: 'TREE_SET_TREE',
        payload,
      }),
  })
)(TemplateButtons);