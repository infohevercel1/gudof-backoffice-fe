import React, { Component } from "react";
import Form from "@rjsf/material-ui";
import { Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Update as UpdateIcon, Delete as DeleteIcon } from "@material-ui/icons"
import axios from "axios";

import Editor from './Editor/Editor';
import "./Templates.css";
import Tree from './Tree';

const log = (type) => console.log.bind(console, type);
const toJson = (val) => JSON.stringify(val, null, 2);

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: false,
      templates: [],
      schema: {
        title: "Todo",
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", title: "Title" },
          done: { type: "boolean", title: "Done?" },
        },
      },
    };
  }

  async componentDidMount () {
    const { data: templates } = await axios.get("https://infohebackoffice.herokuapp.com/templates")
    this.setState({templates})
  }

  toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({anchor: open})
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

  onSchemaEdited = (schema) => this.setState({ schema, shareURL: null });

  list = (anchor) => {
    return (
      <div
        role="presentation"
        onClick={this.toggleDrawer(anchor, false)}
        onKeyDown={this.toggleDrawer(anchor, false)}
      >
        <List>
          {this.state.templates.map((obj, index) => (
            <ListItem button key={index}>
              <ListItemText primary={obj.name} />
              <ListItemIcon><DeleteIcon /></ListItemIcon>
              <ListItemIcon><UpdateIcon /></ListItemIcon>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }

  render() {
    return (
      <>
        <Drawer open={this.state.anchor} onClose={this.toggleDrawer("", false)}>
          {this.list("")}
        </Drawer>
        <div className="flex-display">
          <div className="equal-width">
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
        <Button color="primary" variant="contained" onClick={this.postTemplate}>
          Post Template
        </Button>
        <Button onClick={this.toggleDrawer("", true)}>View Templates</Button>
      </>
    );
  }
}

export default Templates;
{/* <>
  <Editor
    className="editor"
    title="JSONSchema"
    code={toJson(this.state.schema)}
    onChange={this.onSchemaEdited}
  />
</> */}