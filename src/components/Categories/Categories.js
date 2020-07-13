import React, { Component } from 'react';
import axios from 'axios';
import './Categories.css';
// after
import SortableTree from 'react-sortable-tree';
import { getTreeFromFlatData, addNodeUnderParent, removeNodeAtPath, removeNode } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import {
  Button,
  Snackbar
} from "@material-ui/core";
import { Alert as MuiAlert } from '@material-ui/lab';

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
            categorySaved: false
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
      console.log(resp)
    }

    saveToBackend (newNode) {
      let newCategory = this.state.newCategory;
      newCategory.categorySaved = false
      this.setState({newCategory})
      return axios.post("https://infohebackoffice.herokuapp.com/categories", {...newNode, name: newNode.title})
        .then(resp => {
          if(resp.status === 201) {
            newCategory.categorySaved = true;
            this.setState({ newCategory });
          }
        })
    }

    handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      let newCategory = this.state.newCategory;
      newCategory.categorySaved = false;
      this.setState({ newCategory });
    };

    setVisibility (bool) {
      let newCategory = this.state.newCategory
      newCategory.ModalVisiblity = bool
      this.setState({newCategory})
    }

    // Redundant function. Saved for new Category Modal
    saveNewCategory (name) {
      let newCategory = this.state.newCategory
      newCategory.name = name
      this.setState({ newCategory })
    }

    render() {
      const getNodeKey = ({ treeIndex }) => treeIndex;
        return (
          <div className="Categories">
            <h3>List of Categories</h3>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                let title = prompt("Enter a category name");
                if (!title) {
                  return;
                }
                const newNode = {
                  title,
                  parent_id: null,
                  path: title,
                };
                this.setState(state => ({
                  categories: state.categories.concat(newNode),
                }))
                this.saveToBackend(newNode);
              }}
            >
              Add New Category
            </Button>
            <SortableTree
              treeData={this.state.categories}
              onChange={(treeData) => this.setState({ categories: treeData })}
              generateNodeProps={({ node, treeIndex, path }) => ({
                buttons: [
                  <button
                    className="btn"
                    onClick={async () => {
                      var title = prompt("Enter the category name");
                      if (!title) {
                        return;
                      }
                      const newNode = {
                        title,
                        parent_id: node._id,
                        path: title, // Temporary
                      };
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
                      this.saveToBackend(newNode);
                    }}
                  >
                    Add Child
                  </button>,
                  <button
                    className="btn"
                    onClick={(event) => {
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
                  </button>,
                ],
              })}
            />
            <NewCategoryModal
              visibility={this.state.newCategory.ModalVisiblity}
              setVisibility={this.setVisibility}
              saveNewCategory={this.saveNewCategory}
            />
            <Snackbar open={this.state.newCategory.categorySaved} autoHideDuration={6000} onClose={this.handleClose}>
              <Alert onClose={this.handleClose} severity="success">
                New Category Saved!
              </Alert>
            </Snackbar>
          </div>

          // Will add this code after building a delete category route in the backend. 
          // generateNodeProps={({ node, path }) => ({
          //   buttons: [
          //     
          //   ],
          // })}
        );
    }
}

export default Categories;
