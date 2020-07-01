import React, { Component } from "react";
import Form from "@rjsf/material-ui";
import Editor from './Editor'

import "./Templates.css";

const log = (type) => console.log.bind(console, type);
const toJson = (val) => JSON.stringify(val, null, 2);

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleClick() {
    const clone = (obj) => Object.assign({}, obj);

    const renameKey = (object, key, newKey) => {
      const clonedObj = clone(object);

      const targetKey = clonedObj[key];

      delete clonedObj[key];

      clonedObj[newKey] = targetKey;

      return clonedObj;
    };

    let schema = this.state.schema;
    let properties = renameKey(schema.properties, "title", "name");
    schema.properties = properties;
    schema.properties.name.title = "Name";
    console.log(schema);
    // schema.properties.title.title = "Name"
    this.setState({ schema });
  }

  handleChange(e) {
    const schema = this.state.schema;
    const newSchema = Object.assign(schema);
    newSchema.properties[e.target.value] = {
      title: e.target.value,
      type: "string",
    };
    console.log(schema);
    this.setState({ schema });
  }
  onSchemaEdited = (schema) => this.setState({ schema, shareURL: null });

  render() {
    return (
      <div>
        <Editor
          title="JSONSchema"
          code={toJson(this.state.schema)}
          onChange={this.onSchemaEdited}
        />
        <div style={{ width: "50%" }}>
          <Form
            schema={this.state.schema}
            onChange={log("changed")}
            onSubmit={log("submitted")}
            onError={log("errors")}
          />
        </div>
      </div>
    );
  }
}

export default Templates;