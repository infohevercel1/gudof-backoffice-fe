import React, { Component } from 'react';
import axios from 'axios';
import './Categories.css';
// after
import SortableTree from 'react-sortable-tree';
import { getTreeFromFlatData, addNodeUnderParent, removeNodeAtPath, removeNode } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import {
  // Button,
  Snackbar
} from "@material-ui/core";
import { Alert as MuiAlert } from '@material-ui/lab';
import { notification, Button } from 'antd';

import NewCategoryModal from './newCategory';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
          categories: [],
          newCategory: {
            ModalVisiblity: false,
            name: "",
            node: null,
            path: null
          },
        };
        this.saveToBackend = this.saveToBackend.bind(this)
        this.setVisibility = this.setVisibility.bind(this)
        this.saveNewCategory = this.saveNewCategory.bind(this)
        this.deleteFromBackend = this.deleteFromBackend.bind(this)
    }

    async componentDidMount () {
        const {data} = await axios.get("https://infohebackoffice.herokuapp.com/categories")
        let categories = data;
        for (var i = 0; i < categories.length; i++) {
            categories[i].title = categories[i].name
        }

        function getKey(node) {
          return node._id;
        }

        function getParentKey(node) {
          return node.parent_id
        }

        const tree = getTreeFromFlatData({flatData: categories, getKey, getParentKey, rootKey: null})
        console.log(tree)

        categories = tree; //populate this from API.
        this.setState({ categories });
    }

    async deleteFromBackend (id) {
      const resp = await axios.delete('https://infohebackoffice.herokuapp.com/categories/'+id)
      if (resp.status === 204) {
        notification['success']({
          message: 'Category Deleted',
          description:
            'The category has been deleted from the database!',
        });
      }
    }

    saveToBackend (newNode) {
      let newCategory = this.state.newCategory;
      this.setState({newCategory})
      return axios.post("https://infohebackoffice.herokuapp.com/categories", {...newNode, name: newNode.title})
        .then(resp => {
          if(resp.status === 201) {
            notification['success']({
              message: 'New Category Saved',
              description:
                'The new category has been added to the database!',
            });
          }
        })
    }

    setVisibility (bool, node, path) {
      let newCategory = this.state.newCategory
      newCategory.ModalVisiblity = bool
      if(node) {
        newCategory.node = node
      }
      if(path) {
        newCategory.path = path
      }
      this.setState({newCategory})
    }

    // Redundant function. Saved for new Category Modal
    saveNewCategory (name) {
      const getNodeKey = ({ treeIndex }) => treeIndex;
      let newCategory = this.state.newCategory
      let {node, path} = newCategory, title = name
      if (!title) {
        return;
      }
      const newNode = {
        title,
        parent_id: node ? node._id : null,
        path: title, // Temporary
      };

      if(node === null) {
        this.setState(state => ({
          categories: state.categories.concat(newNode),
        }))
      } else {
        this.setState((state) => ({
          categories: addNodeUnderParent({
            treeData: state.categories,
            parentKey: path[path.length - 1],
            expandParent: true,
            getNodeKey,
            newNode,
            addAsFirstChild: state.addAsFirstChild,
          }).treeData,
        }));
      }
      this.saveToBackend(newNode);
    }

    render() {
      const getNodeKey = ({ treeIndex }) => treeIndex;
        return (
          <div className="Categories">
            <h3>List of Categories</h3>
            <Button
              type="primary"
              onClick={() => {
                this.setVisibility(true)
              }}
            >
              Add New Category
            </Button>
            <SortableTree
              treeData={this.state.categories}
              onChange={(treeData) => this.setState({ categories: treeData })}
              generateNodeProps={({ node, path }) => ({
                buttons: [
                  <Button
                    onClick={async () => {
                      this.setVisibility(true, node, path)
                    }}
                  >
                    Add Child
                  </Button>,
                  <Button
                    onClick={(event) => {
                      console.log(node)
                      this.setState(state => ({
                        categories: removeNodeAtPath({
                          treeData: state.categories,
                          path,
                          getNodeKey,
                        }),
                      }))
                      this.deleteFromBackend(node._id)
                    }
                  }>
                    Remove
                  </Button>,
                ],
              })}
            />
            <NewCategoryModal
              visibility={this.state.newCategory.ModalVisiblity}
              setVisibility={this.setVisibility}
              saveNewCategory={this.saveNewCategory}
            />
          </div>
        );
    }
}

export default Categories;
