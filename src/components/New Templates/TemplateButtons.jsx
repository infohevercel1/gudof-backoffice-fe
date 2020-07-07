import React, { Component } from 'react';
import { Modal, Button, List } from 'antd';
import axios from "axios";
import { connect } from "react-redux";

class TemplateButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibile: false,
      templates: []
    };
  }

  async componentDidMount () {
      const { data: templates } = await axios.get(
        "https://infohebackoffice.herokuapp.com/templates"
      );
      this.setState({ templates });
  }

  postToBackend = async (e) => {
    const schema = this.props.tree.present[0].schema,
      uiSchema = this.props.tree.present[0].uiSchema,
      category_id = "5ef5e95f6d957a00173e32b5", // Temp
      body = {
        name: schema.title,
        category_id,
        formSchema: JSON.stringify(schema),
        uiSchema: JSON.stringify(uiSchema),
      };
    const resp = await axios.post(
      "https://infohebackoffice.herokuapp.com/templates",
      body
    );
    const newId = resp.data.id,
      response = resp.status;
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
        <Button style={{ marginLeft: "10%" }} onClick={this.postToBackend}>
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
              <li key={template._id}>{template.name}</li>
            ))}
          </ul>
        </Modal>
      </>
    );
  }
}

export default connect(
  ({ tree }) => ({ tree }),
)(TemplateButtons);