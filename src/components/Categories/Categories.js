import React, { Component } from 'react';
import axios from 'axios';
import './Categories.css';
// after
import SortableTree from 'react-sortable-tree';
import { getTreeFromFlatData, addNodeUnderParent, removeNodeAtPath, removeNode } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import { notification, Button } from 'antd';

import NewCategoryModal from './New';
import DeleteCategoryModal  from './Delete';

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
          deleteCategory: {
            ModalVisiblity: false,
            node: null,
            path: null
          }
        };
        this.saveToBackend = this.saveToBackend.bind(this)
        this.newModalVisibility = this.newModalVisibility.bind(this)
        this.saveNewCategory = this.saveNewCategory.bind(this)
        
        this.deleteFromBackend = this.deleteFromBackend.bind(this)
        this.deleteModalVisibility = this.deleteModalVisibility.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
    }

    async componentDidMount () {
        const {data} = await axios.get("https://infohebackoffice.herokuapp.com/categories")
        let categories = data;
        categories.splice(i, 1); // Removing an erroneous null value. Will be omitted after backend changes.
        for (var i = 0; i < categories.length; i++) {
          categories[i].title = categories[i].name
          try {
            const { data: products } = await axios.get("https://infohebackoffice.herokuapp.com/product/category/"+categories[i]._id)
            categories[i].products = products.length
          } catch (e) {
          }
        }

        function getKey(node) {
          return node._id;
        }

        function getParentKey(node) {
          return node.parent_id
        }

        const tree = getTreeFromFlatData({flatData: categories, getKey, getParentKey, rootKey: null})

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

    newModalVisibility (bool, node, path) {
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

    deleteModalVisibility(bool, node, path) {
      let deleteCategory = this.state.deleteCategory
      deleteCategory.ModalVisiblity = bool
      if (node) {
        deleteCategory.node = node
      }
      if (path) {
        deleteCategory.path = path
      }
      this.setState({ deleteCategory })
    }

    deleteCategory (bool) {
      const getNodeKey = ({ treeIndex }) => treeIndex;
      let {node, path} = this.state.deleteCategory
      this.setState(state => ({
        categories: removeNodeAtPath({
          treeData: state.categories,
          path,
          getNodeKey,
        }),
      }))
      this.deleteFromBackend(node._id)
    }

    render() {
        return (
          <div className="Categories">
            <h3>List of Categories</h3>
            <Button
              type="primary"
              onClick={() => {
                this.newModalVisibility(true)
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
                      console.log(node)
                      this.newModalVisibility(true, node, path)
                    }}
                  >
                    Add Child
                  </Button>,
                  // If a category has children or a category has an existing template, it cannot be deleted. 
                  (!node.children && node.template_id === null) ? (<Button
                    onClick={(event) => {
                      this.deleteModalVisibility(true, node, path)
                    }
                  }>
                    Remove
                  </Button>) : null,
                  (!node.template_id) ? (<Button
                    href={`/template?category=${node._id}`}
                  >
                    Add Template
                  </Button>) : [(<Button
                    key={`edit-${node._id}`}
                    href={`/template?category=${node._id}&template=${node.template_id}`}
                  >
                    View/Edit Template
                  </Button>),
                  (<Button
                    key={`addprod-${node._id}`}
                    href={`/addproduct?category=${node._id}&template=${node.template_id}`}
                  >
                    Add Product
                  </Button>),
                  (<Button
                    key={`editprod-${node._id}`}
                    href={`/product?category=${node._id}`}
                  >
                    View/Edit Product
                  </Button>)],
                  (node.products === 0 && node.template_id !== null) ? (<Button
                    key={`remove-${node._id}`}
                    onClick={async (event) => {
                      const resp = await axios.delete(`https://infohebackoffice.herokuapp.com/templates/${node.template_id}`)
                      if (resp.status === 204) {
                        notification['success']({
                          message: 'Template Deleted',
                          description:
                            'The template has been removed from the database!',
                        });
                        let categories = this.state.categories;
                        categories.forEach(cat => {
                          if (cat._id === node._id) {
                            cat.template_id = null;
                          }
                        })
                        this.setState({ categories })
                      }
                    }}
                  >
                    Remove Template
                  </Button>) : null
                ],
              })}
            />
            <NewCategoryModal
              visibility={this.state.newCategory.ModalVisiblity}
              setVisibility={this.newModalVisibility}
              saveNewCategory={this.saveNewCategory}
            />
            <DeleteCategoryModal
              visibility={this.state.deleteCategory.ModalVisiblity}
              setVisibility={this.deleteModalVisibility}
              deleteCategory={this.deleteCategory}
            />
          </div>
        );
    }
}

export default Categories;
