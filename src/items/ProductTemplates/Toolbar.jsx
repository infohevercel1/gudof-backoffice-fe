import React from 'react';
import {instance as api} from "../../axios";
import { connect } from 'react-redux';
import { Button,Tooltip, Modal, notification, List } from 'antd';
import { FolderOpenOutlined, SaveOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { ActionTypes } from 'redux-undo';
import './index.css';

const buttonStyle = { marginLeft: 8 };
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      templates: [],
      categories: [],
      templateId: null,
      categoryId: null,
      
    };
  }

  async componentDidMount() {
    const { data: templates } = await api.get(
      "/templates"
    );
    const templateProperties = {
      categoryId: this.props.category,
      templateId: this.props.template
    }
    this.setState({ templates, ...templateProperties });
    if (templateProperties.templateId !== null)
      this.renderThisTemplate(templateProperties.templateId)
    else {
      let schema = {
        type: "object",
        properties: {
          manufacturer: {
            type: "string",
            title: "Manufacturer"
          },
          model: {
            type: "string",
            title: "Model"
          },
          image: {
            type: "string",
            title: "Image"
          },
          description: {
            type: "string",
            title: "Description"
          },
          price: {
            type: "string",
            title: "Price"
          }
        }
      },
      uiSchema = {}
 
      const { data: category } = await api.get('/categories/'+this.state.categoryId)
      console.log(category)
      const stringFacet = this.props.stringFacet
      const numberFacet =this.props.numberFacet
      const searchable =this.props.searchable
      // Will receive category_name to add in name of template
      let name=`${category.name}-template`;
      this.props.setTree({name, schema, uiSchema,stringFacet,numberFacet,searchable});
    }
  }

  newTemplate = () => {
    this.setState({ templateId: null })
  }

  save = async () => {
    const {name , schema, uiSchema } = this.props.tree.present[0];
    const body = {
        name,
        category_id: this.state.categoryId,
        formSchema: JSON.stringify(schema),
        uiSchema: (uiSchema !== undefined) ? JSON.stringify(uiSchema) : "",
        stringFacets:this.props.stringFacet,
        numericFacets:this.props.numberFacet,
        searchable:this.props.searchable
      };
    try {
      let resp;
      console.log("body",body)
      if(this.state.templateId === null) {
        resp = await api.post(
          "/templates",
          body
        );
      } else {
        resp = await api.patch(
          "/templates",
          {...body, id: this.state.templateId}
        );
      }
      const response = resp.status;
      if (response === 201) {
        notification.open({
          message: 'Template Created',
          description:
          'Your new template was added to the database.'
        });
      } else if (response === 200) {
        notification.open({
          message: 'Template Update',
          description:
            'Your new template was updated in the database.'
        });
      }
    } catch (e) {
      console.log(e);
      notification.open({
        message: 'Sorry, Template could not be created.',
        description: 'There was some error in the backend'
      })
    }
  };

  showTemplates = async () => {
    let { data: categories } = await api.get(
      "/categories"
    );
    categories = categories.filter(category => category !== null && category.template_id !== null)
    this.setState({
      visible: true,
      categories
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  renderThisTemplate = async (_id) => {
    
    const stringFacet = this.props.stringFacet.join(',')
      const numberFacet =this.props.numberFacet.join(',')
      const searchable =this.props.searchable.join(',')
      console.log(stringFacet,numberFacet)
    let [thisTemplate] = this.state.templates.filter(template => template._id === _id)
    let schema = JSON.parse(thisTemplate.formSchema), uiSchema = {}, name = thisTemplate.name
    if (thisTemplate.uiSchema !== "") {
      uiSchema = JSON.parse(thisTemplate.uiSchema)
    }
    this.props.setTree({ name, schema, uiSchema,stringFacet,numberFacet,searchable });
    console.log("tree",this.props.tree)
    this.setState({ visible: false, existingTemplate: true, templateId: thisTemplate._id })
  }

  render() {
    const { tree, undo, redo } = this.props;
    const { past, future } = tree;
    return (
      <span>
        {/* <Tooltip title="New" onClick={this.newTemplate}>
          <Button
            style={buttonStyle}
            onClick={newForm}
            icon={<FileAddOutlined />}
          />
        </Tooltip> */}
        <Tooltip title="Open">  
          <Button
            style={buttonStyle}
            onClick={() => this.showTemplates()}
            icon={<FolderOpenOutlined />}
          >
            Open
          </Button>
        </Tooltip>
        <Tooltip title="Save">
          <Button
            style={buttonStyle}
            onClick={() => {
              Modal.confirm({
                title: 'Confirm',
                content: `Are you sure you want to ${this.state.templateId === null ? 'save' : 'update'} this Template?`,
                okText: 'OK',
                cancelText: 'Cancel',
                onOk: () => this.save()
              });
            }}
            icon={<SaveOutlined />}
          >
            {this.state.templateId === null ? 'Save' : 'Update'}
          </Button>
        </Tooltip>
        <Tooltip title="Undo">
          <Button
            style={buttonStyle}
            onClick={undo}
            disabled={!past.length}
            icon={<UndoOutlined />}
          >
            Undo
          </Button>
        </Tooltip>
        <Tooltip title="Redo">
          <Button
            style={buttonStyle}
            onClick={redo}
            disabled={!future.length}
            icon={<RedoOutlined />}
          >
            Redo
          </Button>
        </Tooltip>
         
        <Modal
          title="View Existing Templates by Category"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button key="back" onClick={this.handleOk}>
              Okay
            </Button>,
          ]}
        >
          <List
            bordered
            dataSource={this.state.categories}
            renderItem={item => (
              <List.Item 
                className="template-list" 
                onClick={() => this.renderThisTemplate(item.template_id)}
              >
                {item.name}
              </List.Item>
            )}
          />
       
        </Modal>
       
      </span>
    );
  }
}

export default connect(
    ({ tree, settings }) => ({ tree, settings }),
    (dispatch) => ({
        newForm: () =>
            dispatch({
                type: 'TREE_CLEAR',
            }),
        setTree: (payload) =>
            dispatch({
                type: 'TREE_SET_TREE',
                payload,
            }),
        undo: () => dispatch({ type: ActionTypes.UNDO }),
        redo: () => dispatch({ type: ActionTypes.REDO }),
        updateSettings: (subViews) =>
        // This function was needed before when a select search bar to toggle subviews of 
        // schema, ui-schema and formData was used in this component. 
            dispatch({
                type: 'SETTINGS_UPDATE',
                payload: { subViews },
            }),
    })
)(Toolbar);
