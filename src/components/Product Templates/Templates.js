import React, { Component } from "react";
import Form from "@rjsf/material-ui";
import { Button } from '@material-ui/core';
import axios from "axios";

import Editor from './Editor/Editor';
import "./Templates.css";
import Tree from './Tree';
import Sidebar from './Sidebar';

const log = (type) => console.log.bind(console, type);
const toJson = (val) => JSON.stringify(val, null, 2);

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      anchor: false,
      schema: {
        title: "Todo",
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", title: "Title" },
          done: { type: "boolean", title: "Done?" },
        },
      },
      updateMode: false,
      updateId: null
    };
  }

  async componentDidMount () {
    const { data: templates } = await axios.get("https://infohebackoffice.herokuapp.com/templates")
    this.setState({templates})
  }

  patchTemplate = async () => {
    try {
      const response = await axios.patch("https://infohebackoffice.herokuapp.com/templates", {template: this.state.schema, _id: this.state.updateId})
    } catch (e) {
      alert('URL Not Working')
    }
  }

  postTemplate = async () => {
    const schema = this.state.schema,
          category_id = "5ef5e95f6d957a00173e32b5", // Temp
          body = {
            name: schema.title,
            category_id,
            formSchema: JSON.stringify(schema),
            uiSchema: ""
          }
    const resp = await axios.post('https://infohebackoffice.herokuapp.com/templates', body)
    const newId = resp.data.id,
          response = resp.status
    if (response === 201) {
      let templates = this.state.templates
      templates.push(body)
      this.setState({templates})
      alert('Template Created')
    }
  }

  toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    this.setState({anchor: open});
  }

  updateTemplate = (_id) => {
    let templates = this.state.templates;
    let [thisTemplate] = templates.filter(template => template._id === _id)
    let formSchema = JSON.parse(thisTemplate.formSchema)
    this.setState({schema: formSchema, updateMode: true, updateId: thisTemplate._id})
    console.log(this.state.schema)
  }

  onSchemaEdited = (schema) => this.setState({ schema, shareURL: null });

  render() {
    return (
      <>
        <Sidebar 
          anchor={this.state.anchor}
          toggleDrawer={this.toggleDrawer}
          templates={this.state.templates}
          updateTemplate={this.updateTemplate}
        />
        <div className="flex-display">
          <div className="left-width">
            <Tree 
              code={this.state.schema} 
              onChange={this.onSchemaEdited} 
            />
          </div>
            <Form
              schema={this.state.schema}
              onChange={log("changed")}
              onSubmit={log("submitted")}
              onError={log("errors")}
            />
        </div>
        <>
          <Editor
            className="editor"
            title="JSONSchema"
            code={toJson(this.state.schema)}
            onChange={this.onSchemaEdited}
          />
        </>
        {this.state.updateMode ?
          (
          <Button color="primary" variant="contained" onClick={this.patchTemplate}>
            Update Template
          </Button>
        ) : null}
        <Button color="primary" variant="contained" onClick={this.postTemplate}>
          Post Template
        </Button>
        <Button onClick={this.toggleDrawer("", true)}>View Templates</Button>
      </>
    );
  }
}

export default Templates;