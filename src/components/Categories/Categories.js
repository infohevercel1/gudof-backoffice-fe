import React, { Component } from 'react';
import axios from 'axios';
import './Categories.css';
// after
import SortableTree from 'react-sortable-tree';
import { getTreeFromFlatData, addNodeUnderParent } from "react-sortable-tree";
import "react-sortable-tree/style.css";

import {
    Button,
} from "@material-ui/core";


class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
          categories: [],
        };
        this.saveToBackend = this.saveToBackend.bind(this)
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

    saveToBackend (newNode) {
      return axios.post("https://infohebackoffice.herokuapp.com/categories", {...newNode, name: newNode.title}).then(resp => resp)
    }

    render() {
      const getNodeKey = ({ treeIndex }) => treeIndex;
        return (
          <div className="Categories">
            {/* <header className="Categories-header"> */}
              <Button variant="contained" color="primary">
                Create New Category
              </Button>
              <SortableTree
                treeData={this.state.categories}
                onChange={(treeData) => this.setState({ categories: treeData })}
                generateNodeProps={({node, path}) => ({
                  buttons: [
                    <button
                      onClick={() => {
                        console.log(node, path)
                        var title = prompt("Enter the category name")
                        if(!title) {
                          return ;
                        }
                        const newNode = {
                          title,
                          parent_id: node._id,
                          path: title   // Temporary
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
                        }))
                        const resp = this.saveToBackend(newNode)
                        console.log(resp)
                      }}
                    >Add Child</button>
                  ]
                })}
              />
            {/* </header> */}
          </div>
          // generateNodeProps={({ node, path }) => ({
          //   buttons: [
          //     <button
          //       onClick={() =>
                  
          //     >
          //       Add Child
          //     </button>,
          //     <button
          //       onClick={() =>
          //         this.setState((state) => ({
          //           treeData: removeNodeAtPath({
          //             treeData: state.treeData,
          //             path,
          //             getNodeKey,
          //           }),
          //         }))
          //       }
          //     >
          //       Remove
          //     </button>,
          //   ],
          // })}
        );
    }
}

export default Categories;
